import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import sql from 'mssql';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const parseSqlServerConnectionString = (connectionString) => {
  try {
    const config = { options: { encrypt: true, trustServerCertificate: true } };
    // Only split by semicolon, not whitespace!
    connectionString.split(';').filter(Boolean).forEach(pair => {
      const [key, ...rest] = pair.split('=');
      if (!key || !rest.length) return;
      const value = rest.join('=').trim();
      switch (key.trim().toLowerCase()) {
        case 'server':
          config.server = value;
          if (value.includes(',')) {
            const [serverName, port] = value.split(',');
            config.server = serverName;
            config.port = parseInt(port.trim());
          }
          break;
        case 'database':
          config.database = value;
          break;
        case 'user id':
        case 'uid':
        case 'user':
          config.user = value;
          break;
        case 'password':
        case 'pwd':
          config.password = value;
          break;
        case 'port':
          config.port = parseInt(value);
          break;
        default:
          if (key.trim().toLowerCase() === 'encrypt') config.options.encrypt = value.toLowerCase() === 'true';
          if (key.trim().toLowerCase() === 'trustservercertificate') config.options.trustServerCertificate = value.toLowerCase() === 'true';
      }
    });

    if (!config.server) {
      throw new Error("The 'server' property is required");
    }
    return config;
  } catch (error) {
    console.error('Error parsing connection string:', error);
    throw new Error('Invalid connection string format: ' + error.message);
  }
};

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const connectionString = req.body.connectionString;

  let schemaInfo = '';
  try {
    const config = parseSqlServerConnectionString(connectionString);
    const pool = await sql.connect(config);

    const schemaQuery = `
      SELECT 
        t.name AS table_name,
        c.name AS column_name,
        ty.name AS data_type
      FROM 
        sys.tables t
        INNER JOIN sys.columns c ON t.object_id = c.object_id
        INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
      ORDER BY 
        t.name, c.column_id;
    `;

    const schemaResult = await pool.request().query(schemaQuery);
    await pool.close();

    const grouped = {};
    schemaResult.recordset.forEach(({ table_name, column_name, data_type }) => {
      if (!grouped[table_name]) grouped[table_name] = [];
      grouped[table_name].push(`${column_name} (${data_type})`);
    });

    const maxTables = 20; 
    const maxColumns = 10;
    const entries = Object.entries(grouped).slice(0, maxTables);
    schemaInfo = entries
      .map(([table, cols]) => {
        const shown = cols.slice(0, maxColumns);
        let line = `${table}: ${shown.join(', ')}`;
        if (cols.length > maxColumns) line += `, ...`;
        return line;
      })
      .join('\n');
    if (Object.keys(grouped).length > maxTables) {
      schemaInfo += `\n...and ${Object.keys(grouped).length - maxTables} more tables.`;
    }

  } catch (err) {
    console.error('Schema fetch error:', err);
    schemaInfo = 'Unable to fetch schema: ' + err.message;
  }

  const systemPrompt = {
    role: "system",
    content: `You are an SQL assistant for SQL Server. The database has the following schema:\n${schemaInfo}\nOnly generate SQL based on these tables and columns. Use SQL Server syntax.`
  };

  const messages = [
    systemPrompt,
    { role: "user", content: userMessage }
  ];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama3-8b-8192",
      temperature: 0.7,
    });

    const botReply = chatCompletion.choices[0]?.message?.content || '';
    console.log('LLM reply:', botReply);
    const sqlMatch = botReply.match(/```sql\s*([\s\S]*?)```/i);
    const sqlQuery = sqlMatch ? sqlMatch[1].trim() : null;

    if (!sqlQuery) {
      return res.json({ reply: botReply });
    }

    try {
      const config = parseSqlServerConnectionString(connectionString);
      const pool = await sql.connect(config);
      const result = await pool.request().query(sqlQuery);
      await pool.close();

      if (!result.recordset || result.recordset.length === 0) {
        const message = result.rowsAffected[0] > 0 
          ? `Query executed successfully. ${result.rowsAffected[0]} rows affected.` 
          : 'Query executed successfully. No rows affected.';
        
        return res.json({ 
          reply: `${botReply}\n\n**Result:** ${message}`
        });
      }

      const columns = Object.keys(result.recordset[0]);
      const rows = result.recordset;
      let table = columns.join('\t') + '\n';
      table += rows.map(row => columns.map(col => row[col] !== null ? row[col] : 'NULL').join('\t')).join('\n');

      // After you get the SQL result:
      const explainPrompt = [
        {
          role: "system",
          content: "You are a helpful assistant. Only respond based on the given SQL result. Do not show the SQL query. Answer the user's question using only the data provided."
        },
        {
          role: "user",
          content: `Question: "${userMessage}"\n\nSQL Result: ${JSON.stringify(result.recordset)}\n\nAnswer the question using only this data.`
        }
      ];

      const explainCompletion = await groq.chat.completions.create({
        messages: explainPrompt,
        model: "llama3-8b-8192",
        temperature: 0.5,
      });
      const finalAnswer = explainCompletion.choices[0]?.message?.content || '';
      return res.json({ reply: finalAnswer });
    } catch (err) {
      console.error('SQL execution error:', err);
      res.json({ reply: `${botReply}\n\n**Error executing SQL:** ${err.message}` });
    }
  } catch (err) {
    console.error('LLM error:', err);
    res.json({ reply: "Error generating SQL: " + err.message });
  }
});

app.post('/api/connect', async (req, res) => {
  const { connectionString } = req.body;
  try {
    const config = parseSqlServerConnectionString(connectionString);
    
    config.options = {
      ...config.options,
      connectTimeout: 15000,
      requestTimeout: 15000
    };
    
    console.log('Attempting to connect with config:', {
      ...config,
      password: '***' 
    });
    
    const pool = await sql.connect(config);
    await pool.close();
    res.json({ success: true });
  } catch (err) {
    console.error('Connection error:', err);
    res.json({ 
      success: false, 
      error: err.message || 'Connection failed'
    });
  }
});

app.get('/', (req, res) => {
  res.send('SQL Server Chatbot API is running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));