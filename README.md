# 🧠 SQL Chatbot – Conversational Interface for Structured Data

A full-stack chatbot that allows users to ask **natural language questions** and receive results from a **SQL database**. Designed for non-technical users to explore and analyze structured data using everyday language.

---

## 🚀 Features

- 🗣️ **Natural Language to SQL**: Converts user queries into executable SQL statements.
- 📊 **Structured Data Support**: Works seamlessly with SQL databases.
- ⚙️ **GROQ SDK Integration**: Uses OpenAI’s GROQ SDK to generate SQL queries.
- 🔍 **RAG (Retrieval-Augmented Generation)**: Improves query accuracy by injecting schema/data context.
- 🌐 **React Frontend**: Simple, responsive UI for real-time chat interaction.
- 🛠️ **Node.js Backend API**: Handles query generation, database execution, and response formatting.
- 🧪 **Regression Testing**: Ensures stable and accurate responses over time.

---

## 🛠 Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **AI/NLP**: OpenAI GROQ SDK + Retrieval-Augmented Generation (RAG)
- **Database**: PostgreSQL / MySQL (customizable)
- **Testing**: Manual regression testing for prompt tuning

---
##🧠 How It Works
User asks a question like:
"How many users signed up last week?"

Backend sends schema + query to GROQ SDK with RAG context.

The model generates an SQL query like:

sql
Copy
Edit
SELECT COUNT(*) FROM users WHERE signup_date >= CURRENT_DATE - INTERVAL '7 days';
The backend executes the query and sends the result to the React UI.

📌 Limitations
Currently supports only SQL-based databases.

Assumes schema context is pre-injected or known to the model.

Designed for internal dashboards and controlled datasets.

---

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Shubham-mohapatra/sql-chatbot.git
cd sql-chatbot





