import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import Database from 'better-sqlite3';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize SQLite database
const dbPath = './sample_database.db';
const db = new Database(dbPath);

// Initialize database with sample data if it doesn't exist
const initializeDatabase = () => {
  try {
    // Check if tables exist
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'").get();
    
    if (!tableCheck) {
      console.log('Initializing database with sample data...');
      
      // Create tables
      const createTablesSQL = `
        CREATE TABLE Users (
          UserID INTEGER PRIMARY KEY AUTOINCREMENT,
          FirstName TEXT NOT NULL,
          LastName TEXT NOT NULL,
          Email TEXT UNIQUE NOT NULL,
          Phone TEXT,
          DateOfBirth DATE,
          Gender TEXT,
          RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          IsActive INTEGER DEFAULT 1
        );

        CREATE TABLE Categories (
          CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
          CategoryName TEXT NOT NULL,
          Description TEXT,
          ParentCategoryID INTEGER,
          CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE Products (
          ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
          ProductName TEXT NOT NULL,
          Description TEXT,
          CategoryID INTEGER NOT NULL,
          Price DECIMAL(10,2) NOT NULL,
          StockQuantity INTEGER NOT NULL DEFAULT 0,
          SKU TEXT UNIQUE,
          Brand TEXT,
          Weight DECIMAL(8,2),
          Dimensions TEXT,
          CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          IsActive INTEGER DEFAULT 1,
          FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
        );

        CREATE TABLE Orders (
          OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
          UserID INTEGER NOT NULL,
          OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          TotalAmount DECIMAL(12,2) NOT NULL,
          OrderStatus TEXT DEFAULT 'Pending',
          ShippingAddress TEXT,
          PaymentMethod TEXT,
          PaymentStatus TEXT DEFAULT 'Pending',
          ShippingDate DATETIME,
          DeliveryDate DATETIME,
          FOREIGN KEY (UserID) REFERENCES Users(UserID)
        );

        CREATE TABLE OrderItems (
          OrderItemID INTEGER PRIMARY KEY AUTOINCREMENT,
          OrderID INTEGER NOT NULL,
          ProductID INTEGER NOT NULL,
          Quantity INTEGER NOT NULL,
          UnitPrice DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
          FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        );

        CREATE TABLE Reviews (
          ReviewID INTEGER PRIMARY KEY AUTOINCREMENT,
          ProductID INTEGER NOT NULL,
          UserID INTEGER NOT NULL,
          Rating INTEGER CHECK (Rating >= 1 AND Rating <= 5),
          ReviewText TEXT,
          ReviewDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          IsVerifiedPurchase INTEGER DEFAULT 0,
          FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
          FOREIGN KEY (UserID) REFERENCES Users(UserID)
        );

        CREATE TABLE Suppliers (
          SupplierID INTEGER PRIMARY KEY AUTOINCREMENT,
          SupplierName TEXT NOT NULL,
          ContactName TEXT,
          ContactEmail TEXT,
          ContactPhone TEXT,
          Address TEXT,
          City TEXT,
          Country TEXT,
          CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Execute table creation
      db.exec(createTablesSQL);

      // Insert sample data
      const insertDataSQL = `
        INSERT INTO Categories (CategoryName, Description, ParentCategoryID) VALUES
        ('Electronics', 'Electronic devices and accessories', NULL),
        ('Computers', 'Desktop and laptop computers', 1),
        ('Mobile Phones', 'Smartphones and mobile accessories', 1),
        ('Clothing', 'Fashion and apparel', NULL),
        ('Books', 'Books and literature', NULL),
        ('Home & Garden', 'Home improvement and gardening', NULL);

        INSERT INTO Users (FirstName, LastName, Email, Phone, DateOfBirth, Gender) VALUES
        ('John', 'Doe', 'john.doe@email.com', '+1234567890', '1990-05-15', 'Male'),
        ('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', '1985-08-22', 'Female'),
        ('Mike', 'Johnson', 'mike.johnson@email.com', '+1234567892', '1992-12-03', 'Male'),
        ('Emily', 'Davis', 'emily.davis@email.com', '+1234567893', '1988-07-18', 'Female'),
        ('Chris', 'Wilson', 'chris.wilson@email.com', '+1234567894', '1995-11-28', 'Male');

        INSERT INTO Suppliers (SupplierName, ContactName, ContactEmail, ContactPhone, Address, City, Country) VALUES
        ('Tech Solutions Inc', 'Robert Lee', 'robert@techsolutions.com', '+1555000001', '123 Tech Street', 'San Francisco', 'USA'),
        ('Global Electronics', 'Maria Rodriguez', 'maria@globalelectronics.com', '+1555000002', '456 Silicon Avenue', 'Austin', 'USA'),
        ('Fashion Wholesale', 'Ahmed Hassan', 'ahmed@fashionwholesale.com', '+1555000003', '789 Fashion Blvd', 'New York', 'USA');

        INSERT INTO Products (ProductName, Description, CategoryID, Price, StockQuantity, SKU, Brand, Weight, Dimensions) VALUES
        ('Gaming Laptop Pro', 'High-performance gaming laptop with RTX graphics', 2, 1299.99, 25, 'LAPTOP-001', 'TechBrand', 2.5, '15.6" x 10.2" x 0.9"'),
        ('Business Ultrabook', 'Lightweight laptop for business professionals', 2, 899.99, 30, 'LAPTOP-002', 'ProTech', 1.2, '14" x 9.1" x 0.6"'),
        ('Smartphone X1', 'Latest flagship smartphone with 5G', 3, 799.99, 50, 'PHONE-001', 'MobileTech', 0.18, '6.1" x 2.8" x 0.3"'),
        ('Budget Phone A1', 'Affordable smartphone with great features', 3, 299.99, 75, 'PHONE-002', 'ValueTech', 0.16, '5.8" x 2.7" x 0.35"'),
        ('Casual T-Shirt', 'Comfortable cotton t-shirt', 4, 24.99, 100, 'SHIRT-001', 'FashionBrand', 0.2, 'Medium'),
        ('Programming Guide', 'Complete guide to software development', 5, 39.99, 40, 'BOOK-001', 'TechBooks', 0.8, '9" x 7" x 1.5"'),
        ('Garden Tool Set', 'Complete set of gardening tools', 6, 149.99, 20, 'GARDEN-001', 'GreenThumb', 3.5, '24" x 12" x 6"');

        INSERT INTO Orders (UserID, OrderDate, TotalAmount, OrderStatus, ShippingAddress, PaymentMethod, PaymentStatus) VALUES
        (1, '2024-01-15 10:30:00', 1319.98, 'Delivered', '123 Main St, Anytown, AT 12345', 'Credit Card', 'Completed'),
        (2, '2024-01-20 14:15:00', 829.98, 'Delivered', '456 Oak Ave, Somewhere, SW 67890', 'PayPal', 'Completed'),
        (3, '2024-02-05 09:45:00', 599.98, 'Shipped', '789 Pine Rd, Elsewhere, EW 13579', 'Credit Card', 'Completed'),
        (4, '2024-02-10 16:20:00', 74.98, 'Processing', '321 Elm St, Nowhere, NW 24680', 'Debit Card', 'Completed'),
        (5, '2024-02-15 11:30:00', 299.99, 'Pending', '654 Maple Dr, Anywhere, AW 97531', 'Credit Card', 'Pending');

        INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES
        (1, 1, 1, 1299.99),
        (2, 3, 1, 799.99),
        (3, 2, 1, 899.99),
        (4, 5, 3, 24.99),
        (5, 4, 1, 299.99);

        INSERT INTO Reviews (ProductID, UserID, Rating, ReviewText, IsVerifiedPurchase) VALUES
        (1, 1, 5, 'Amazing gaming laptop! Runs all my games smoothly at high settings.', 1),
        (3, 2, 4, 'Great phone with excellent camera quality. Battery life could be better.', 1),
        (5, 4, 5, 'Perfect fit and very comfortable. Great quality for the price.', 1),
        (6, 3, 4, 'Very comprehensive programming guide. Great for beginners.', 1);
      `;

      db.exec(insertDataSQL);
      console.log('✅ Sample database created successfully!');
    } else {
      console.log('✅ Database already exists and is ready to use!');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize the database
initializeDatabase();

// Get database schema
const getSchema = () => {
  try {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();

    let schemaInfo = '';
    
    for (const table of tables) {
      const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
      const columnInfo = columns.map(col => `${col.name} (${col.type})`).join(', ');
      schemaInfo += `${table.name}: ${columnInfo}\n`;
    }
    
    return schemaInfo;
  } catch (error) {
    console.error('Error getting schema:', error);
    return 'Unable to fetch schema';
  }
};

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Get schema information
  const schemaInfo = getSchema();

  const systemPrompt = {
    role: "system",
    content: `You are an SQL assistant for SQLite. The database has the following schema:\n${schemaInfo}\nOnly generate SQL based on these tables and columns. Use SQLite syntax. Always use double quotes for identifiers if needed.`
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
    
    // Extract SQL query
    const sqlMatch = botReply.match(/\`\`\`sql\s*([\s\S]*?)\`\`\`/i);
    const sqlQuery = sqlMatch ? sqlMatch[1].trim() : null;

    if (!sqlQuery) {
      return res.json({ reply: botReply });
    }

    try {
      // Execute the SQL query
      const stmt = db.prepare(sqlQuery);
      let result;
      
      if (sqlQuery.trim().toLowerCase().startsWith('select')) {
        result = stmt.all();
      } else {
        result = stmt.run();
      }

      if (!result || (Array.isArray(result) && result.length === 0)) {
        return res.json({ 
          reply: `${botReply}\n\n**Result:** Query executed successfully. No rows returned.`
        });
      }

      // Format the response
      if (Array.isArray(result)) {
        // For SELECT queries
        const explainPrompt = [
          {
            role: "system",
            content: "You are a helpful assistant. Only respond based on the given SQL result. Do not show the SQL query. Answer the user's question using only the data provided."
          },
          {
            role: "user",
            content: `Question: "${userMessage}"\n\nSQL Result: ${JSON.stringify(result)}\n\nAnswer the question using only this data.`
          }
        ];

        const explainCompletion = await groq.chat.completions.create({
          messages: explainPrompt,
          model: "llama3-8b-8192",
          temperature: 0.5,
        });
        
        const finalAnswer = explainCompletion.choices[0]?.message?.content || '';
        return res.json({ reply: finalAnswer });
      } else {
        // For INSERT/UPDATE/DELETE queries
        return res.json({ 
          reply: `${botReply}\n\n**Result:** Query executed successfully. ${result.changes || 0} rows affected.`
        });
      }
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
  // For SQLite, we don't need a connection string - just check if database is accessible
  try {
    const testQuery = db.prepare('SELECT 1 as test').get();
    res.json({ success: true });
  } catch (err) {
    console.error('Database test error:', err);
    res.json({ 
      success: false, 
      error: err.message || 'Database connection failed'
    });
  }
});

app.get('/', (req, res) => {
  res.send('SQL Chatbot API with SQLite is running!');
});

app.get('/api/schema', (req, res) => {
  const schema = getSchema();
  res.json({ schema });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log('📁 Database file: ' + path.resolve(dbPath));
  console.log('🔗 Test connection at: http://localhost:3000');
});
