DROP DATABASE IF EXISTS TooEasyDB;
CREATE DATABASE TooEasyDB;

USE TooEasyDB;

-- Table Creation
CREATE TABLE Customer(
	AccountID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
	EmailAddr VARCHAR(50) UNIQUE NOT NULL,
    ContactNo VARCHAR(8) UNIQUE NOT NULL CHECK (ContactNo NOT LIKE '%[^0-9]%'),
    MemberStatus BOOLEAN DEFAULT FALSE, 
    MembershipExpiry DATE,
    DateJoined TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    PfpPath VARCHAR(50),
    Password VARCHAR(50) NOT NULL
);

CREATE TABLE Admin(
	AdminID INT PRIMARY KEY,
    Username VARCHAR(20) NOT NULL,
    Password VARCHAR(20) NOT NULL
);

CREATE TABLE Child (
	ChildID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50),
    Strength VARCHAR(100),
    DOB DATE NOT NULL,
    AccountID INT NOT NULL,

    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID)
);

CREATE TABLE ProgramType (
  TypeID INT PRIMARY KEY AUTO_INCREMENT,
  TypeDesc VARCHAR(50) NOT NULL
);

CREATE TABLE Program (
	ProgramID INT PRIMARY KEY AUTO_INCREMENT,
    ProgramName  VARCHAR(50) NOT NULL NOT NULL,
    Cost INT NOT NULL,
    TypeID INT NOT NULL,
    
    FOREIGN KEY (TypeID) REFERENCES ProgramType(TypeID)
);

CREATE TABLE Session (
	SessionID INT PRIMARY KEY,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    Location VARCHAR(100) NOT NULL,
    ProgramID INT, 
    
    FOREIGN KEY (ProgramID) REFERENCES Program(ProgramID)
);

CREATE TABLE Lunch (
	LunchOptionID INT PRIMARY KEY AUTO_INCREMENT, 
    LunchDesc VARCHAR(100) NOT NULL
);

CREATE TABLE SignUp (
	SignUpID INT PRIMARY KEY AUTO_INCREMENT,
	AccountID INT, 
    SessionID INT, 
    LunchOptionID INT NOT NULL,
    ChildID INT,
    
    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID),
    FOREIGN KEY (SessionID) REFERENCES Session(SessionID),
    FOREIGN KEY (LunchOptionID) REFERENCES Lunch(LunchOptionID),
    FOREIGN KEY(ChildID) REFERENCES Child(ChildID)
);

CREATE TABLE Booking (
	BookingID INT PRIMARY KEY AUTO_INCREMENT,
    Time TIME NOT NULL,
    Date DATE NOT NULL,
    AccountID INT,
    
    FOREIGN KEY (AccountID) REFERENCES Customer (AccountID)
);

CREATE TABLE Payment (
	OrderID INT PRIMARY KEY AUTO_INCREMENT,
	InvoiceID INT NOT NULL,
    Amount INT NOT NULL,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    ApprovedStatus BOOL NOT NULL, 
    InvoicePath VARCHAR(100) NOT NULL,
    SessionID INT NOT NULL,
    PaidBy INT NOT NULL, 
    Reason VARCHAR(100) NULL,
    ApprovedBy INT NULL,
    
    FOREIGN KEY(SessionID) REFERENCES Session(SessionID),
    FOREIGN KEY (PaidBy) REFERENCES Customer (AccountID),
    FOREIGN KEY (ApprovedBy) REFERENCES Admin (AdminID)
);

-- Data Insertion
USE TooEasyDB;

INSERT INTO Customer (AccountID, Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, PfpPath, Password)
VALUES
(1, 'John Doe', 'johndoe@example.com', '12345678', TRUE, '2024-12-31', NULL, 'password123'),
(2, 'Jane Smith', 'janesmith@example.com', '90123456', FALSE, NULL, NULL, 'password456'),
(3, 'Bob Johnson', 'bobjohnson@example.com', '78901234', TRUE, '2025-06-30', NULL, 'password789'),
(4, 'Alice Brown', 'alicebrown@example.com', '56789012', FALSE, NULL, NULL, 'password012'),
(5, 'Mike Davis', 'ikedavis@example.com', '34567890', TRUE, '2024-03-31', NULL, 'password345');

INSERT INTO Admin (AdminID, Username, Password)
VALUES
(1, 'admin1', 'adminpassword1'),
(2, 'admin2', 'adminpassword2');

INSERT INTO Child (ChildID, Name, Strength, DOB, AccountID)
VALUES
(1, 'Emily Doe', 'Swimming', '2012-08-15', 1),
(2, 'Max Doe', 'Basketball', '2015-02-20', 1),
(3, 'Sophia Smith', 'Tennis', '2010-11-01', 2),
(4, 'Oliver Johnson', 'Soccer', '2013-04-10', 2),
(5, 'Ava Brown', 'Dancing', '2011-06-25', 1);

INSERT INTO ProgramType (TypeID, TypeDesc)
VALUES
(1, 'Workshop'),
(2, 'Camps'),
(3, 'Labs'),
(4, 'Professional'),
(5, 'Webinar');

INSERT INTO Program (ProgramID, ProgramName, Cost, TypeID)
VALUES
(1, 'Public Speaking Workshop - Beginner', 788, 1),
(2, 'Public Speaking Workshop - Intermediate', 988, 1),
(3, 'Public Speaking Workshop - Advanced', 1388, 1),
(4, 'PSLE Power Up Camp - PSLE Power Up', 388, 1),
(5, 'PSLE Power Up Camp - PSLE Chinese Oral Booster', 488, 1);

INSERT INTO Session (SessionID, Date, Time, Location, ProgramID)
VALUES
(1, '2025-01-04', '10:00:00', 'Auditorium A', 1),
(2, '2025-07-11', '14:00:00', 'Classroom B', 1),
(3, '2025-07-18', '10:00:00', 'Auditorium C', 1),
(4, '2025-07-25', '14:00:00', 'Classroom B', 1);

INSERT INTO Lunch (LunchOptionID, LunchDesc)
VALUES
(1, 'Veggie Wrap'),
(2, 'Chicken Sandwich'),
(3, 'Fruit Salad'),
(4, 'Turkey Burger'),
(5, 'Pasta Bowl');

INSERT INTO SignUp (SignUpID, AccountID, SessionID, LunchOptionID, ChildID)
VALUES
(1, 1, 1, 1, 1),  -- John Doe, Public Speaking Workshop - Beginner, Veggie Wrap
(2, 2, 2, 2, 3),  -- Jane Smith, Public Speaking Workshop - Intermediate, Chicken Sandwich
(3, 3, 3, 3, 4),  -- Bob Johnson, Public Speaking Workshop - Advanced, Fruit Salad
(4, 4, 4, 4, 2);  -- Alice Brown, PSLE Power Up Camp - PSLE Power Up, Turkey Burger

INSERT INTO Booking (BookingID, Time, Date, AccountID)
VALUES
(1, '09:00:00', '2025-01-15', 1),
(2, '11:00:00', '2025-01-16', 2),
(3, '13:00:00', '2025-01-17', 3),
(4, '15:00:00', '2025-01-18', 4),
(5, '17:00:00', '2025-01-19', 5);

INSERT INTO Payment (OrderID, InvoiceID, Amount, CreatedAt, ApprovedStatus, InvoicePath, SessionID, PaidBy, ApprovedBy, Reason)
VALUES
(1, 46382751, 788, '2024-10-02 12:00:00', TRUE, 'path/to/invoice-46382751.pdf', 1, 1, NULL, NULL),
(2, 93157026, 988, '2024-10-10 12:00:00', TRUE, 'path/to/invoice-93157026.pdf', 2, 2, NULL, NULL),
(3, 67491350, 1388, '2024-10-15 12:00:00', TRUE, 'path/to/invoice-67491350.pdf', 3, 3, NULL, NULL),
(4, 28653104, 388, '2024-10-20 12:00:00', TRUE, 'path/to/invoice-28653104.pdf', 4, 4, NULL, NULL);