-- Sample Database Creation Script for SQL Chatbot Testing
-- This creates a comprehensive e-commerce database with realistic data

-- Create Database (uncomment if creating new database)
-- CREATE DATABASE ECommerceSample;
-- USE ECommerceSample;

-- Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Phone NVARCHAR(20),
    DateOfBirth DATE,
    Gender NVARCHAR(10),
    RegistrationDate DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- Categories Table
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    ParentCategoryID INT NULL,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Products Table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    CategoryID INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    SKU NVARCHAR(50) UNIQUE,
    Brand NVARCHAR(100),
    Weight DECIMAL(8,2),
    Dimensions NVARCHAR(100),
    CreatedDate DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Orders Table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(12,2) NOT NULL,
    OrderStatus NVARCHAR(50) DEFAULT 'Pending',
    ShippingAddress NVARCHAR(500),
    PaymentMethod NVARCHAR(50),
    PaymentStatus NVARCHAR(50) DEFAULT 'Pending',
    ShippingDate DATETIME NULL,
    DeliveryDate DATETIME NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Order Items Table
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalPrice AS (Quantity * UnitPrice),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Reviews Table
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT NOT NULL,
    UserID INT NOT NULL,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    ReviewText NVARCHAR(1000),
    ReviewDate DATETIME DEFAULT GETDATE(),
    IsVerifiedPurchase BIT DEFAULT 0,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Suppliers Table
CREATE TABLE Suppliers (
    SupplierID INT PRIMARY KEY IDENTITY(1,1),
    SupplierName NVARCHAR(200) NOT NULL,
    ContactName NVARCHAR(100),
    ContactEmail NVARCHAR(100),
    ContactPhone NVARCHAR(20),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    Country NVARCHAR(100),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Product Suppliers Table (Many-to-Many relationship)
CREATE TABLE ProductSuppliers (
    ProductID INT NOT NULL,
    SupplierID INT NOT NULL,
    SupplyPrice DECIMAL(10,2),
    LeadTime INT, -- Days
    PRIMARY KEY (ProductID, SupplierID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

-- Add some indexes for better performance
CREATE INDEX IX_Products_CategoryID ON Products(CategoryID);
CREATE INDEX IX_Orders_UserID ON Orders(UserID);
CREATE INDEX IX_Orders_OrderDate ON Orders(OrderDate);
CREATE INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);
CREATE INDEX IX_OrderItems_ProductID ON OrderItems(ProductID);
CREATE INDEX IX_Reviews_ProductID ON Reviews(ProductID);
CREATE INDEX IX_Reviews_UserID ON Reviews(UserID);
