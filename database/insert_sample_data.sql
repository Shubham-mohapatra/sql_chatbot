-- Sample Data Insertion Script
-- This populates the database with realistic test data

-- Insert Categories
INSERT INTO Categories (CategoryName, Description, ParentCategoryID) VALUES
('Electronics', 'Electronic devices and accessories', NULL),
('Computers', 'Desktop and laptop computers', 1),
('Mobile Phones', 'Smartphones and mobile accessories', 1),
('Clothing', 'Fashion and apparel', NULL),
('Men''s Clothing', 'Clothing for men', 4),
('Women''s Clothing', 'Clothing for women', 4),
('Books', 'Books and literature', NULL),
('Fiction', 'Fiction books and novels', 7),
('Non-Fiction', 'Educational and reference books', 7),
('Home & Garden', 'Home improvement and gardening', NULL);

-- Insert Users
INSERT INTO Users (FirstName, LastName, Email, Phone, DateOfBirth, Gender, RegistrationDate) VALUES
('John', 'Doe', 'john.doe@email.com', '+1234567890', '1990-05-15', 'Male', '2023-01-15'),
('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', '1985-08-22', 'Female', '2023-02-20'),
('Mike', 'Johnson', 'mike.johnson@email.com', '+1234567892', '1992-12-03', 'Male', '2023-03-10'),
('Emily', 'Davis', 'emily.davis@email.com', '+1234567893', '1988-07-18', 'Female', '2023-04-05'),
('Chris', 'Wilson', 'chris.wilson@email.com', '+1234567894', '1995-11-28', 'Male', '2023-05-12'),
('Sarah', 'Brown', 'sarah.brown@email.com', '+1234567895', '1991-04-09', 'Female', '2023-06-18'),
('David', 'Miller', 'david.miller@email.com', '+1234567896', '1987-09-14', 'Male', '2023-07-22'),
('Lisa', 'Garcia', 'lisa.garcia@email.com', '+1234567897', '1993-02-25', 'Female', '2023-08-30');

-- Insert Suppliers
INSERT INTO Suppliers (SupplierName, ContactName, ContactEmail, ContactPhone, Address, City, Country) VALUES
('Tech Solutions Inc', 'Robert Lee', 'robert@techsolutions.com', '+1555000001', '123 Tech Street', 'San Francisco', 'USA'),
('Global Electronics', 'Maria Rodriguez', 'maria@globalelectronics.com', '+1555000002', '456 Silicon Avenue', 'Austin', 'USA'),
('Fashion Wholesale', 'Ahmed Hassan', 'ahmed@fashionwholesale.com', '+1555000003', '789 Fashion Blvd', 'New York', 'USA'),
('Book Distributors', 'Jennifer Kim', 'jennifer@bookdist.com', '+1555000004', '321 Library Lane', 'Chicago', 'USA'),
('Home Essentials', 'Carlos Santos', 'carlos@homeessentials.com', '+1555000005', '654 Garden Road', 'Seattle', 'USA');

-- Insert Products
INSERT INTO Products (ProductName, Description, CategoryID, Price, StockQuantity, SKU, Brand, Weight, Dimensions) VALUES
-- Electronics/Computers
('Gaming Laptop Pro', 'High-performance gaming laptop with RTX graphics', 2, 1299.99, 25, 'LAPTOP-001', 'TechBrand', 2.5, '15.6" x 10.2" x 0.9"'),
('Business Ultrabook', 'Lightweight laptop for business professionals', 2, 899.99, 30, 'LAPTOP-002', 'ProTech', 1.2, '14" x 9.1" x 0.6"'),
('Desktop Workstation', 'Powerful desktop for creative work', 2, 1599.99, 15, 'DESKTOP-001', 'WorkTech', 8.5, '18" x 8" x 16"'),

-- Electronics/Mobile Phones
('Smartphone X1', 'Latest flagship smartphone with 5G', 3, 799.99, 50, 'PHONE-001', 'MobileTech', 0.18, '6.1" x 2.8" x 0.3"'),
('Budget Phone A1', 'Affordable smartphone with great features', 3, 299.99, 75, 'PHONE-002', 'ValueTech', 0.16, '5.8" x 2.7" x 0.35"'),
('Phone Case Clear', 'Transparent protective case', 3, 19.99, 200, 'CASE-001', 'ProtectTech', 0.05, '6.2" x 3" x 0.4"'),

-- Clothing/Men's
('Men''s Casual T-Shirt', 'Comfortable cotton t-shirt', 5, 24.99, 100, 'SHIRT-M-001', 'FashionBrand', 0.2, 'Medium'),
('Men''s Jeans Classic', 'Classic fit blue jeans', 5, 59.99, 60, 'JEANS-M-001', 'DenimCo', 0.8, '32W x 34L'),
('Men''s Sneakers Sport', 'Athletic sneakers for daily wear', 5, 89.99, 40, 'SHOES-M-001', 'SportFeet', 0.9, 'Size 10'),

-- Clothing/Women's
('Women''s Summer Dress', 'Elegant summer dress in floral pattern', 6, 49.99, 35, 'DRESS-W-001', 'StyleCo', 0.3, 'Size M'),
('Women''s Running Shoes', 'Lightweight running shoes', 6, 79.99, 45, 'SHOES-W-001', 'RunFast', 0.7, 'Size 8'),
('Women''s Handbag', 'Stylish leather handbag', 6, 119.99, 25, 'BAG-W-001', 'LuxuryBags', 0.6, '12" x 8" x 4"'),

-- Books/Fiction
('The Great Adventure', 'Epic fantasy novel bestseller', 8, 14.99, 80, 'BOOK-F-001', 'PublishCo', 0.4, '8" x 5" x 1"'),
('Mystery at Midnight', 'Thrilling mystery novel', 8, 12.99, 65, 'BOOK-F-002', 'MysteryBooks', 0.35, '7.5" x 5" x 0.8"'),

-- Books/Non-Fiction
('Learn Programming', 'Complete guide to software development', 9, 39.99, 40, 'BOOK-NF-001', 'TechBooks', 0.8, '9" x 7" x 1.5"'),
('Business Strategy', 'Modern business management techniques', 9, 29.99, 35, 'BOOK-NF-002', 'BusinessPress', 0.6, '8.5" x 6" x 1"'),

-- Home & Garden
('Garden Tool Set', 'Complete set of gardening tools', 10, 149.99, 20, 'GARDEN-001', 'GreenThumb', 3.5, '24" x 12" x 6"'),
('LED Smart Bulb', 'Color-changing smart LED bulb', 10, 24.99, 100, 'BULB-001', 'SmartHome', 0.1, '4" x 2.4" diameter');

-- Insert Product-Supplier relationships
INSERT INTO ProductSuppliers (ProductID, SupplierID, SupplyPrice, LeadTime) VALUES
(1, 1, 999.99, 7),   -- Gaming Laptop from Tech Solutions
(2, 1, 699.99, 5),   -- Business Ultrabook from Tech Solutions
(3, 1, 1299.99, 10), -- Desktop from Tech Solutions
(4, 2, 599.99, 3),   -- Smartphone from Global Electronics
(5, 2, 199.99, 3),   -- Budget Phone from Global Electronics
(6, 2, 9.99, 1),     -- Phone Case from Global Electronics
(7, 3, 14.99, 2),    -- Men's T-Shirt from Fashion Wholesale
(8, 3, 39.99, 5),    -- Men's Jeans from Fashion Wholesale
(9, 3, 59.99, 7),    -- Men's Sneakers from Fashion Wholesale
(10, 3, 29.99, 4),   -- Women's Dress from Fashion Wholesale
(11, 3, 49.99, 6),   -- Women's Shoes from Fashion Wholesale
(12, 3, 79.99, 8),   -- Women's Handbag from Fashion Wholesale
(13, 4, 8.99, 2),    -- Fiction Book 1 from Book Distributors
(14, 4, 7.99, 2),    -- Fiction Book 2 from Book Distributors
(15, 4, 24.99, 3),   -- Programming Book from Book Distributors
(16, 4, 19.99, 3),   -- Business Book from Book Distributors
(17, 5, 99.99, 14),  -- Garden Tools from Home Essentials
(18, 5, 14.99, 7);   -- Smart Bulb from Home Essentials

-- Insert Orders
INSERT INTO Orders (UserID, OrderDate, TotalAmount, OrderStatus, ShippingAddress, PaymentMethod, PaymentStatus, ShippingDate, DeliveryDate) VALUES
(1, '2024-01-15 10:30:00', 1319.98, 'Delivered', '123 Main St, Anytown, AT 12345', 'Credit Card', 'Completed', '2024-01-16', '2024-01-20'),
(2, '2024-01-20 14:15:00', 829.98, 'Delivered', '456 Oak Ave, Somewhere, SW 67890', 'PayPal', 'Completed', '2024-01-21', '2024-01-25'),
(3, '2024-02-05 09:45:00', 599.98, 'Shipped', '789 Pine Rd, Elsewhere, EW 13579', 'Credit Card', 'Completed', '2024-02-06', NULL),
(4, '2024-02-10 16:20:00', 74.98, 'Processing', '321 Elm St, Nowhere, NW 24680', 'Debit Card', 'Completed', NULL, NULL),
(5, '2024-02-15 11:30:00', 1599.99, 'Pending', '654 Maple Dr, Anywhere, AW 97531', 'Credit Card', 'Pending', NULL, NULL),
(6, '2024-03-01 13:45:00', 169.98, 'Delivered', '987 Cedar Ln, Someplace, SP 86420', 'PayPal', 'Completed', '2024-03-02', '2024-03-05'),
(7, '2024-03-10 08:15:00', 54.98, 'Delivered', '147 Birch St, Everytown, ET 75319', 'Credit Card', 'Completed', '2024-03-11', '2024-03-15'),
(8, '2024-03-20 15:00:00', 1419.97, 'Cancelled', '258 Willow Ave, Hometown, HT 95173', 'Credit Card', 'Refunded', NULL, NULL);

-- Insert Order Items
INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES
-- Order 1 (John Doe - Gaming Laptop + Phone Case)
(1, 1, 1, 1299.99),  -- Gaming Laptop
(1, 6, 1, 19.99),    -- Phone Case

-- Order 2 (Jane Smith - Smartphone + Phone Case)
(2, 4, 1, 799.99),   -- Smartphone
(2, 6, 1, 19.99),    -- Phone Case
(2, 18, 1, 24.99),   -- Smart Bulb

-- Order 3 (Mike Johnson - Men's clothing)
(3, 7, 2, 24.99),    -- 2x Men's T-Shirts
(3, 8, 1, 59.99),    -- Men's Jeans
(3, 9, 1, 89.99),    -- Men's Sneakers

-- Order 4 (Emily Davis - Women's Shoes + Dress)
(4, 11, 1, 79.99),   -- Women's Shoes
(4, 10, 1, 49.99),   -- Women's Dress

-- Order 5 (Chris Wilson - Desktop Workstation)
(5, 3, 1, 1599.99),  -- Desktop Workstation

-- Order 6 (Sarah Brown - Books + Handbag)
(6, 13, 1, 14.99),   -- Fiction Book
(6, 15, 1, 39.99),   -- Programming Book
(6, 12, 1, 119.99),  -- Women's Handbag

-- Order 7 (David Miller - Budget Phone + Books)
(7, 5, 1, 299.99),   -- Budget Phone
(7, 14, 1, 12.99),   -- Mystery Book
(7, 16, 1, 29.99),   -- Business Book

-- Order 8 (Lisa Garcia - Multiple items - Cancelled)
(8, 2, 1, 899.99),   -- Business Ultrabook
(8, 4, 1, 799.99),   -- Smartphone
(8, 17, 1, 149.99);  -- Garden Tools

-- Insert Reviews
INSERT INTO Reviews (ProductID, UserID, Rating, ReviewText, ReviewDate, IsVerifiedPurchase) VALUES
(1, 1, 5, 'Amazing gaming laptop! Runs all my games smoothly at high settings.', '2024-01-25', 1),
(4, 2, 4, 'Great phone with excellent camera quality. Battery life could be better.', '2024-01-30', 1),
(7, 3, 5, 'Perfect fit and very comfortable. Great quality for the price.', '2024-02-15', 1),
(8, 3, 4, 'Good quality jeans, but took a while to break in.', '2024-02-15', 1),
(9, 3, 5, 'Super comfortable sneakers, perfect for daily wear and light exercise.', '2024-02-15', 1),
(11, 4, 3, 'Decent running shoes but not as cushioned as expected.', '2024-02-20', 1),
(13, 6, 5, 'Couldn''t put this book down! Fantastic story and characters.', '2024-03-10', 1),
(15, 6, 4, 'Very comprehensive programming guide. Great for beginners.', '2024-03-10', 1),
(5, 7, 4, 'Good value for money. Does everything I need from a smartphone.', '2024-03-20', 1),
(14, 7, 5, 'Gripping mystery that kept me guessing until the end!', '2024-03-20', 1),
(1, 8, 5, 'Best laptop I''ve ever owned. Worth every penny!', '2024-02-01', 0),
(4, 3, 4, 'Considering upgrading to this phone. Looks great!', '2024-02-10', 0);
