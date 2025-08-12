# Database Setup Instructions

## Option 1: Using SQL Server LocalDB (Recommended for Testing)

### Install SQL Server Express LocalDB
1. Download SQL Server Express from Microsoft
2. During installation, make sure to include LocalDB
3. Or download just LocalDB: https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb

### Create and Setup Database
```bash
# Connect to LocalDB
sqlcmd -S "(localdb)\MSSQLLocalDB"

# Create database
CREATE DATABASE ECommerceSample;
GO
USE ECommerceSample;
GO

# Run the table creation script
:r "C:\Users\KIIT\Desktop\sqlchatbot\database\create_sample_db.sql"
GO

# Run the data insertion script
:r "C:\Users\KIIT\Desktop\sqlchatbot\database\insert_sample_data.sql"
GO
```

### Connection String for LocalDB
```
Server=(localdb)\MSSQLLocalDB;Database=ECommerceSample;Integrated Security=true;
```

## Option 2: Using SQL Server Management Studio (SSMS)

### Setup Steps
1. Open SQL Server Management Studio
2. Connect to your SQL Server instance
3. Right-click "Databases" → "New Database"
4. Name it "ECommerceSample"
5. Open a new query window
6. Copy and paste the contents of `create_sample_db.sql`
7. Execute the script
8. Copy and paste the contents of `insert_sample_data.sql`
9. Execute the script

### Connection String for SSMS
```
Server=YOUR_SERVER_NAME;Database=ECommerceSample;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;
```

## Option 3: Using Docker SQL Server

### Start SQL Server in Docker
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sqlserver2022 --hostname sqlserver2022 \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

### Connect and Setup
```bash
# Connect to the container
docker exec -it sqlserver2022 /opt/mssql-tools/bin/sqlcmd \
   -S localhost -U SA -P "YourStrong@Passw0rd"

# Create database and run scripts
CREATE DATABASE ECommerceSample;
GO
USE ECommerceSample;
GO
```

### Connection String for Docker
```
Server=localhost,1433;Database=ECommerceSample;User Id=SA;Password=YourStrong@Passw0rd;
```

## Test Queries for Your Chatbot

Once your database is set up, you can test these queries with your chatbot:

### Basic Queries
- "Show me all users"
- "How many orders do we have?"
- "What are the top 5 most expensive products?"
- "Show me all categories"

### Advanced Queries
- "Which user has placed the most orders?"
- "What's the total revenue from all completed orders?"
- "Show me products with low stock (less than 30 items)"
- "Which products have the highest ratings?"
- "Show me sales by category"
- "Find users who haven't placed any orders yet"

### Complex Analysis Queries
- "What's the average order value by month?"
- "Which suppliers provide the most products?"
- "Show me the top 3 customers by total spending"
- "What percentage of orders are delivered on time?"
- "Which products are frequently bought together?"

## Database Schema Overview

The sample database includes:
- **Users**: Customer information and registration details
- **Categories**: Product categorization (hierarchical)
- **Products**: Product catalog with pricing and inventory
- **Orders**: Order tracking and status
- **OrderItems**: Individual items within orders
- **Reviews**: Product reviews and ratings
- **Suppliers**: Supplier information
- **ProductSuppliers**: Product-supplier relationships

## Testing Your Chatbot

1. Start your backend server: `npm start` (in backend directory)
2. Start your frontend: `npm start` (in frontend directory)
3. Use one of the connection strings above in your chatbot
4. Test with the sample queries provided above

## Sample Connection Strings

Choose the appropriate one based on your setup:

### LocalDB (No authentication needed)
```
Server=(localdb)\MSSQLLocalDB;Database=ECommerceSample;Integrated Security=true;
```

### SQL Server with Windows Authentication
```
Server=YOUR_SERVER_NAME;Database=ECommerceSample;Integrated Security=true;
```

### SQL Server with SQL Authentication
```
Server=YOUR_SERVER_NAME;Database=ECommerceSample;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;
```

### Docker SQL Server
```
Server=localhost,1433;Database=ECommerceSample;User Id=SA;Password=YourStrong@Passw0rd;
```
