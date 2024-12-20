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
    Age INT NOT NULL DEFAULT 0,
    AccountID INT NOT NULL,

    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID)
);

CREATE TABLE ProgramType (
  TypeID INT PRIMARY KEY AUTO_INCREMENT,
  TypeDesc VARCHAR(50) NOT NULL
);

CREATE TABLE Program (
	ProgramID INT PRIMARY KEY AUTO_INCREMENT,
    ProgramName  VARCHAR(50) NOT NULL,
    ProgramDesc VARCHAR(100) NOT NULL,
    Cost INT NOT NULL,
    DiscountedCost INT NOT NULL DEFAULT 0,
    LunchProvided BOOL NOT NULL,
    Duration INT NOT NULL,
    ClassSize INT NOT NULL,
    TypeID INT NOT NULL,
    
    FOREIGN KEY (TypeID) REFERENCES ProgramType(TypeID)
);

CREATE TABLE Webinar (
	WebinarID INT PRIMARY KEY AUTO_INCREMENT,
    WebinarName VARCHAR(50) NOT NULL,
    WebinarDesc VARCHAR(100) NOT NULL,
    Link VARCHAR(100) NOT NULL,
    Date DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL, 
    Speaker VARCHAR(50) NOT NULL
);

CREATE TABLE Session (
	SessionID INT PRIMARY KEY AUTO_INCREMENT,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Time TIME NOT NULL,
    Location VARCHAR(100) NOT NULL,
	Vacancy INT NOT NULL DEFAULT 0,
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
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Date DATE NOT NULL,
    URL VARCHAR(100),
    AccountID INT,
    
    FOREIGN KEY (AccountID) REFERENCES Customer (AccountID)
);

CREATE TABLE Payment (
	OrderID INT PRIMARY KEY AUTO_INCREMENT,
	InvoiceID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
	CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    Status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    InvoicePath VARCHAR(100) NOT NULL,
    SessionID INT NOT NULL,
    PaidBy INT NOT NULL, 
    Reason VARCHAR(100) NULL,
    ApprovedBy INT NULL,
    
    FOREIGN KEY(SessionID) REFERENCES Session(SessionID),
    FOREIGN KEY (PaidBy) REFERENCES Customer (AccountID),
    FOREIGN KEY (ApprovedBy) REFERENCES Admin (AdminID)
);

CREATE TABLE Announcement (
	AnnouncementID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(100) NOT NULL,
    Body VARCHAR(400) NOT NULL,
    PostedDate DATE NOT NULL
);

-- Data Insertion
USE TooEasyDB;

INSERT INTO Customer (AccountID, Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, PfpPath, Password)
VALUES
(1, 'John Doe', 'johndoe@example.com', '12345678', TRUE, '2024-12-31', NULL, 'password123'),
(2, 'Jane Smith', 'janesmith@example.com', '90123456', FALSE, NULL, NULL, 'password456'),
(3, 'Bob Johnson', 'bobjohnson@example.com', '78901234', TRUE, '2025-06-30', NULL, 'password789'),
(4, 'Alice Brown', 'alicebrown@example.com', '56789012', FALSE, NULL, NULL, 'password012'),
(5, 'Mike Davis', 'ikedavis@example.com', '34567890', TRUE, '2024-03-31', NULL, 'password345'),
(6, 'Caden Toh', 'example@example.com', '10006000', FALSE, NULL, NULL, 'password123');

INSERT INTO Admin (AdminID, Username, Password)
VALUES
(1, 'admin1', 'adminpassword1'),
(2, 'admin2', 'adminpassword2');

INSERT INTO Child (ChildID, Name, Strength, DOB, Age, AccountID)
VALUES
(1, 'Emily Doe', 'Swimming', '2012-08-15', 12,  1),
(2, 'Max Doe', 'Basketball', '2015-02-20', 9,  1),
(3, 'Sophia Smith', 'Tennis', '2010-11-01', 14,  2),
(4, 'Oliver Johnson', 'Soccer', '2013-04-10', 11,  2),
(5, 'Ava Brown', 'Dancing', '2011-06-25', 13,  1);

INSERT INTO ProgramType (TypeID, TypeDesc)
VALUES
(1, 'Workshop'),
(2, 'Camps'),
(3, 'Labs'),
(4, 'Professional');

INSERT INTO Program (ProgramName, ProgramDesc, Cost, DiscountedCost, LunchProvided, Duration, ClassSize, TypeID)
VALUES
('Public Speaking Workshop - Beginner', 'Learn the basics of public speaking', 788, 709.2, TRUE, 8, 15, 1),
('Public Speaking Workshop - Intermediate', 'Improve your public speaking skills', 988, 889.2, TRUE, 8, 15, 1),
('Public Speaking Workshop - Advanced', 'Master the art of public speaking', 1388, 1249.2, TRUE, 8, 10, 1),
('PSLE Power Up Camp - PSLE Power Up', 'Comprehensive PSLE revision', 388, 349.2, FALSE, 2, 20, 2),
('PSLE Power Up Camp - PSLE Chinese Oral Booster', 'Boost your Chinese oral skills', 488, 439.2, FALSE, 2, 15, 2);

INSERT INTO Webinar (WebinarName, WebinarDesc, Link, Date, StartTime, EndTime, Speaker)
VALUES
('Mastering Python', 'Learn the fundamentals of Python programming', 'https://www.python.org/about/gettingstarted/', '2024-11-13', '10:00:00', '12:00:00', 'Dr. Python'),
('Data Science 101', 'Introduction to data science concepts and tools', 'https://www.datasciencecentral.com/', '2024-11-20', '13:30:00', '15:30:00', 'Prof. Data'),
('Web Development Workshop', 'Build dynamic web applications with HTML, CSS, and JavaScript', 'https://www.w3schools.com/', '2024-11-27', '09:00:00', '11:00:00', 'Mr. Web'),
('AI and Machine Learning', 'Explore the world of artificial intelligence and machine learning', 'https://www.machinelearningmastery.com/', '2024-12-04', '14:00:00', '16:00:00', 'Ms. AI'),
('Cybersecurity Basics', 'Learn how to protect your digital assets', 'https://www.cybersecurityventures.com/', '2024-12-11', '11:00:00', '13:00:00', 'Captain Cyber');

INSERT INTO Session (SessionID, StartDate, EndDate, Time, Location, Vacancy, ProgramID)
VALUES
(1, '2025-01-04', '2025-01-05', '10:00:00', 'Auditorium A', 15, 1),
(2, '2025-07-11', '2025-07-12', '14:00:00', 'Classroom B', 15, 1),
(3, '2025-07-18', '2025-07-19', '10:00:00', 'Auditorium C', 15, 1),
(4, '2025-07-25', '2025-07-26', '14:00:00', 'Classroom B', 15, 1);

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

INSERT INTO Booking (BookingID, StartTime, EndTime, Date, URL, AccountID)
VALUES
(1, '09:00:00', '10:00:00', '2025-01-15', NULL, 1),
(2, '11:00:00', '12:00:00', '2025-01-16', NULL,2),
(3, '13:00:00', '14:00:00', '2025-01-17', NULL,3),
(4, '15:00:00', '16:00:00', '2025-01-18', NULL,4),
(5, '17:00:00', '18:00:00', '2025-01-19', NULL,5);

INSERT INTO Payment (OrderID, InvoiceID, Amount, CreatedAt, Status, InvoicePath, SessionID, PaidBy, ApprovedBy, Reason)
VALUES
(1, 46382751, 788, '2024-10-02 12:00:00', 'Pending', 'path/to/invoice-46382751.pdf', 1, 1, NULL, NULL),
(2, 93157026, 988, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157026.pdf', 2, 2, NULL, NULL),
(3, 67491350, 1388, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491350.pdf', 3, 3, 1, 'Approved by Admin 1'),
(4, 28653104, 388, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653104.pdf', 4, 4, NULL, NULL);

INSERT INTO Announcement (AnnouncementID, Title, Body, PostedDate) 
VALUES 
(1, 'Release of new programs', 'To all our dear and valued customers, we are excited to announce that with the upcoming holidays, new programs are to be released soon! So Stay tune!', '2024-11-11'),
(2, 'New promotions', 'In lieu of certain events and happenings, new promotions are to be rolled out! Members can await for the arrival soon!', '2024-11-13'),
(3, 'Christmas Promotion', 'New year new me! Enjoy upcoming promotions that are being pushed out in light of the New Year! Have a happy holidays!', '2023-11-13'),
(4, 'Halloween Specials', 'Trick or treat! This year halloween is a very special one, for there are more programs that are to be enrolled on how you can spook your competitors!', '2024-10-13');

Trigger

-- Add Age On Insertion
DELIMITER //
CREATE TRIGGER update_age
BEFORE INSERT ON Child
FOR EACH ROW
BEGIN
    SET NEW.Age = YEAR(CURDATE()) - YEAR(NEW.DOB);
END;
//
DELIMITER ;

-- Add Age On Update
DELIMITER //
CREATE TRIGGER update_age_on_update
BEFORE UPDATE ON Child
FOR EACH ROW
BEGIN
    SET NEW.Age = YEAR(CURDATE()) - YEAR(NEW.DOB);
END;
//
DELIMITER ;

-- Add Discount Cost On Insertion
DELIMITER //
CREATE TRIGGER update_discount_cost
BEFORE INSERT ON Program
FOR EACH ROW
BEGIN
    SET NEW.DiscountedCost = NEW.Cost * 0.9;
END;
//
DELIMITER ;

-- Update Discount Cost on Update
DELIMITER //
CREATE TRIGGER update_discount_cost_on_update
BEFORE UPDATE ON Program
FOR EACH ROW
BEGIN
    SET NEW.DiscountedCost = NEW.Cost * 0.9;
END;
//
DELIMITER ;

-- Update Vacancy on Post in SignUp
DELIMITER //
CREATE TRIGGER decrease_vacancy
AFTER INSERT ON SignUp
FOR EACH ROW
BEGIN
    UPDATE Session
    SET Vacancy = Vacancy - 1
    WHERE SessionID = NEW.SessionID;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER increase_vacancy
AFTER DELETE ON SignUp
FOR EACH ROW
BEGIN
    UPDATE Session
    SET Vacancy = Vacancy + 1
    WHERE SessionID = OLD.SessionID;
END;
//
DELIMITER ;