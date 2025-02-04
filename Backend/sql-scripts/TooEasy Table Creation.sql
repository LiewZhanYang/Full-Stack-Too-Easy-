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

CREATE TABLE Child (DROP DATABASE IF EXISTS TooEasyDB;
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
    SpecialLearningNeeds VARCHAR(255) DEFAULT NULL,
    DietaryRestrictions VARCHAR(255) DEFAULT NULL,
    Notes VARCHAR(255) DEFAULT NULL,

    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID)
);

CREATE TABLE ProgramType (
  TypeID INT PRIMARY KEY AUTO_INCREMENT,
  TypeDesc VARCHAR(50) NOT NULL
);

CREATE TABLE Program (
    ProgramID INT PRIMARY KEY AUTO_INCREMENT,
    ProgramName VARCHAR(50) NOT NULL,
    ProgramDesc VARCHAR(100) NOT NULL,
    TypeID INT NOT NULL,
    FOREIGN KEY (TypeID) REFERENCES ProgramType(TypeID)
);

CREATE TABLE Tier (
    TierID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    ClassSize INT NOT NULL,
    Cost INT NOT NULL,
    DiscountedCost INT NOT NULL DEFAULT 0,
    LunchProvided BOOLEAN,
    Duration INT NOT NULL
);

CREATE TABLE ProgramTier (
    ProgramID INT,
    TierID INT,
    PRIMARY KEY (ProgramID, TierID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ProgramID),
    FOREIGN KEY (TierID) REFERENCES Tier(TierID)
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
    Status ENUM('Active', 'Cancelled') NOT NULL DEFAULT 'Active',
    TierID INT NOT NULL,
    ProgramID INT NOT NULL,  -- 
    
    FOREIGN KEY (TierID) REFERENCES Tier(TierID),
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

CREATE TABLE Review (
	ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    Content VARCHAR(200) NOT NULL,
    Star INT NOT NULL,
    Date DATE NOT NULL,
    AccountID INT NOT NULL,
    ProgramID INT NOT NULL,
    
    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ProgramID)
);
CREATE TABLE TransferRequest (
    TransferID INT PRIMARY KEY AUTO_INCREMENT,
    SignUpID INT NOT NULL,
    NewSessionID INT NOT NULL,
    Reason VARCHAR(255) NOT NULL,
    MCPath TEXT NULL,
    RequestedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Confirmed') NOT NULL DEFAULT 'Pending',

    FOREIGN KEY (SignUpID) REFERENCES SignUp(SignUpID) ON DELETE CASCADE,
    FOREIGN KEY (NewSessionID) REFERENCES Session(SessionID)
);

CREATE TABLE Ticketing (
    TicketID INT PRIMARY KEY AUTO_INCREMENT,
    AccountID INT NOT NULL,
    Category ENUM('Payment', 'Technical', 'General', 'Other') NOT NULL,
    Content TEXT NOT NULL,
    StartDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID)
);

CREATE TABLE Comments (
    CommentID INT PRIMARY KEY AUTO_INCREMENT,
    TicketID INT NOT NULL,
    CommenterID INT NOT NULL,
    IsAdmin BOOLEAN NOT NULL,
    Content TEXT NOT NULL,
    CommentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TicketID) REFERENCES Ticketing(TicketID) ON DELETE CASCADE
);

CREATE TABLE Forum (
	ForumID INT PRIMARY KEY AUTO_INCREMENT,
    Topic VARCHAR(100) NOT NULL 
);

CREATE TABLE Thread (
    ThreadID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(100) NULL,
    Body VARCHAR(500) NOT NULL,
    CreatedOn DATE NOT NULL,
    Likes INT NOT NULL DEFAULT 0,
    SentimentValue FLOAT NOT NULL,
    PostedBy INT NOT NULL,
    Topic INT NOT NULL,
    ReplyTo INT NULL,
    
    FOREIGN KEY (PostedBy) REFERENCES Customer(AccountID),
    FOREIGN KEY (Topic) REFERENCES Forum(ForumID),
    FOREIGN KEY (ReplyTo) REFERENCES Thread(ThreadID)
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
(6, 'Caden Toh', 'example@example.com', '10006000', FALSE, NULL, NULL, 'password123'),
(7, 'Sarah Lee', 'sarahlee@example.com', '98765432', TRUE, '2025-09-15', NULL, 'password567'),
(8, 'David Kim', 'davidkim@example.com', '87654321', FALSE, NULL, NULL, 'password678'),
(9, 'Emma Wilson', 'emmawilson@example.com', '76543210', TRUE, '2026-01-20', NULL, 'password789'),
(10, 'James Tan', 'jamestan@example.com', '65432109', FALSE, NULL, NULL, 'password890'),
(11, 'Olivia Chen', 'oliviachen@example.com', '54321098', TRUE, '2025-07-05', NULL, 'password901'),
(12, 'Ethan Wright', 'ethanwright@example.com', '43210987', FALSE, NULL, NULL, 'password012'),
(13, 'Charlotte Lim', 'charlottelim@example.com', '32109876', TRUE, '2024-11-22', NULL, 'password123'),
(14, 'Liam Koh', 'liamkoh@example.com', '21098765', TRUE, '2025-04-10', NULL, 'password234'),
(15, 'Sophia Ng', 'sophiang@example.com', '10987654', FALSE, NULL, NULL, 'password345'),
(16, 'Daniel Ong', 'danielong@example.com', '19876543', TRUE, '2026-02-28', NULL, 'password456');

INSERT INTO Admin (AdminID, Username, Password)
VALUES
(1, 'admin1', 'adminpassword1'),
(2, 'admin2', 'adminpassword2');

INSERT INTO Child (ChildID, Name, Strength, DOB, Age, AccountID, SpecialLearningNeeds, DietaryRestrictions, Notes)
VALUES
(1, 'Emily Doe', 'Swimming', '2012-08-15', 12, 1, 'Dyslexia', 'None', 'Emily is very enthusiastic about swimming. Needs additional support with reading instructions.'),
(2, 'Max Doe', 'Basketball', '2015-02-20', 9, 1, NULL, 'Peanut Allergy', 'Carries an EpiPen. Ensure no exposure to peanuts during events.'),
(3, 'Sophia Smith', 'Tennis', '2010-11-01', 14, 2, NULL, 'Vegetarian', 'Prefers not to eat meat. Ensure meal options are available.'),
(4, 'Oliver Johnson', 'Soccer', '2013-04-10', 11, 2, 'ADHD', NULL, 'Very energetic and needs frequent breaks. Responds well to structured activities.'),
(5, 'Ava Brown', 'Dancing', '2011-06-25', 13, 1, NULL, 'Lactose Intolerant', 'Avoid dairy products. Provide alternative milk if needed.'),
(6, 'Lucas Kim', 'Martial Arts', '2014-09-12', 10, 8, 'Mild Autism', 'None', 'Prefers a quiet environment. Ensure instructors give clear and direct instructions.'),
(7, 'Mia Wilson', 'Painting', '2016-05-30', 8, 9, NULL, 'Nut Allergy', 'Check all snacks for nut content. Keep emergency contacts updated.'),
(8, 'Noah Tan', 'Football', '2013-07-21', 11, 10, NULL, NULL, 'Shows great teamwork skills but needs encouragement in social interactions.'),
(9, 'Lily Chen', 'Gymnastics', '2015-02-17', 9, 11, 'Dyspraxia', NULL, 'May struggle with coordination but is eager to improve. Provide extra practice time.'),
(10, 'Benjamin Wright', 'Chess', '2012-12-09', 12, 12, NULL, 'Gluten-Free Diet', 'Ensure all meals and snacks meet dietary requirements.'),
(11, 'Zoe Lim', 'Ballet', '2014-03-22', 10, 13, 'Speech Delay', NULL, 'Prefers non-verbal communication. Encourage participation through gestures.'),
(12, 'Nathan Koh', 'Running', '2011-10-18', 13, 14, NULL, NULL, 'Very competitive but gets discouraged easily. Needs positive reinforcement.'),
(13, 'Ella Ng', 'Singing', '2016-07-05', 8, 15, 'Mild Anxiety', 'None', 'May get nervous in large groups. Allow extra time to settle in before activities.'),
(14, 'Ryan Ong', 'Cycling', '2013-08-29', 11, 16, NULL, 'Shellfish Allergy', 'Avoid any seafood exposure. Parents provided emergency medication.'),
(15, 'Hannah Ong', 'Piano', '2015-11-15', 9, 16, 'Dyslexia', 'None', 'Struggles with reading sheet music but has excellent musical memory. Provide extra verbal instructions.');

INSERT INTO ProgramType (TypeID, TypeDesc)
VALUES
(1, 'Workshop'),
(2, 'Camps'),
(3, 'Labs'),
(4, 'Professional');

INSERT INTO Tier (Name, ClassSize, Cost, DiscountedCost, LunchProvided, Duration) 
VALUES 
('Beginner', 15, 788, 709.2, TRUE, 8),
('Intermediate', 10, 988, 889.2, TRUE, 15),
('Advanced', 10, 1388, 1249.2, TRUE, 10),
('PSLE Power Up', 15, 388, 349.2, FALSE, 20),
('PSLE Chinese Oral Booster', 10, 488, 439.2, FALSE, 15); 

INSERT INTO Program (ProgramName, ProgramDesc, TypeID)
VALUES
('Public Speaking Workshop', 'Learn the basics of public speaking', 1),
('PSLE Power Up Camp - PSLE Power Up', 'Comprehensive PSLE revision', 2);

INSERT INTO ProgramTier 
VALUES
	(1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5);

INSERT INTO Webinar (WebinarName, WebinarDesc, Link, Date, StartTime, EndTime, Speaker)
VALUES
('Mastering Python', 'Learn the fundamentals of Python programming', 'https://www.python.org/about/gettingstarted/', '2024-11-13', '10:00:00', '12:00:00', 'Dr. Python'),
('Data Science 101', 'Introduction to data science concepts and tools', 'https://www.datasciencecentral.com/', '2024-11-20', '13:30:00', '15:30:00', 'Prof. Data'),
('Web Development Workshop', 'Build dynamic web applications with HTML, CSS, and JavaScript', 'https://www.w3schools.com/', '2024-11-27', '09:00:00', '11:00:00', 'Mr. Web'),
('AI and Machine Learning', 'Explore the world of artificial intelligence and machine learning', 'https://www.machinelearningmastery.com/', '2024-12-04', '14:00:00', '16:00:00', 'Ms. AI'),
('Cybersecurity Basics', 'Learn how to protect your digital assets', 'https://www.cybersecurityventures.com/', '2024-12-11', '11:00:00', '13:00:00', 'Captain Cyber');

INSERT INTO Session (StartDate, EndDate, Time, Location, Vacancy, Status, TierID, ProgramID) VALUES
('2025-02-10', '2025-02-11', '10:00:00', 'Auditorium A', 15, 'Active', 1, 1),  -- Beginner - Public Speaking Workshop
('2025-02-15', '2025-02-16', '14:00:00', 'Classroom B', 15, 'Active', 1, 1),
('2025-02-20', '2025-02-21', '10:00:00', 'Auditorium C', 10, 'Active', 2, 1),  -- Intermediate - Public Speaking Workshop
('2025-02-25', '2025-02-26', '14:00:00', 'Classroom D', 10, 'Active', 2, 1),
('2025-03-01', '2025-03-02', '10:00:00', 'Auditorium E', 10, 'Active', 3, 1),  -- Advanced - Public Speaking Workshop
('2025-03-05', '2025-03-06', '14:00:00', 'Classroom F', 10, 'Active', 3, 1),
('2025-03-10', '2025-03-11', '10:00:00', 'Auditorium G', 15, 'Active', 4, 2),  -- PSLE Power Up - PSLE Camp
('2025-03-15', '2025-03-16', '14:00:00', 'Classroom H', 15, 'Active', 4, 2),
('2025-03-20', '2025-03-21', '10:00:00', 'Auditorium I', 10, 'Active', 5, 2),  -- PSLE Chinese Oral Booster - PSLE Camp
('2025-03-25', '2025-03-26', '14:00:00', 'Classroom J', 10, 'Active', 5, 2);


INSERT INTO Lunch (LunchOptionID, LunchDesc)
VALUES
(1, 'Veggie Wrap'),
(2, 'Chicken Sandwich'),
(3, 'Fruit Salad'),
(4, 'Turkey Burger'),
(5, 'Pasta Bowl');

INSERT INTO SignUp (SignUpID, AccountID, SessionID, LunchOptionID, ChildID)
VALUES
(1, 1, 1, 1, 1),
(2, 1, 2, 2, 2),
(3, 2, 2, 3, 3),
(4, 2, 3, 4, 4),
(5, 1, 4, 1, 5),
(6, 8, 5, 2, 6),
(7, 9, 6, 1, 7),
(8, 10, 1, 5, 8),
(9, 11, 2, 3, 9),
(10, 12, 3, 4, 10),
(11, 13, 4, 3, 11),
(12, 14, 5, 2, 12),
(13, 15, 6, 1, 13),
(14, 16, 1, 5, 14),
(15, 16, 2, 1, 15),
(16, 1, 8, 1, 1),
(17, 1, 8, 1, 2),
(18, 2, 8, 1, 3),
(19, 2, 7, 1, 4),
(20, 1, 7, 1, 5);


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
(2, 93157026, 788, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157026.pdf', 2, 1, NULL, NULL),
(3, 67491350, 788, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491350.pdf', 2, 2, 1, 'Approved by Admin 1'),
(4, 28653104, 988, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653104.pdf', 3, 2, NULL, NULL),
(5, 67491351, 988, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491351.pdf', 4, 1, 1, 'Approved by Admin 2'),
(6, 93157027, 1388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157027.pdf', 5, 8, NULL, NULL),
(7, 28653105, 1388, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653105.pdf', 6, 9, NULL, NULL),
(8, 67491352, 788, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491352.pdf', 1, 10, 1, 'Approved by Admin 3'),
(9, 93157028, 788, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157028.pdf', 2, 11, NULL, NULL),
(10, 28653106, 988, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653106.pdf', 3, 12, NULL, NULL),
(11, 67491353, 988, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491353.pdf', 4, 13, 1, 'Approved by Admin 4'),
(12, 93157029, 1388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157029.pdf', 5, 14, NULL, NULL),
(13, 28653107, 1388, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653107.pdf', 6, 15, NULL, NULL),
(14, 67491354, 788, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491354.pdf', 1, 16, 1, 'Approved by Admin 5'),
(15, 93157030, 788, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 2, 16, NULL, NULL),
(16, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 8, 1, NULL, NULL),
(17, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 8, 1, NULL, NULL),
(18, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 8, 2, NULL, NULL),
(19, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 7, 2, NULL, NULL),
(20, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 7, 1, NULL, NULL);

INSERT INTO Announcement (AnnouncementID, Title, Body, PostedDate)
VALUES 
(1, 'Happy New Year!', 'Wishing all our customers a fantastic New Year! Get ready for a fresh start with exciting new programs and promotions ahead!', '2025-01-01'),
(2, 'Chinese New Year Promotions', 'Celebrate Chinese New Year with us! We are rolling out special discounts and packages for this festive season. Stay tuned for more details!', '2025-01-29'),
(3, 'Exciting Programs for the Year Ahead', 'Start the year strong with our newly launched programs! Check out our updated lineup and enroll now for early-bird offers!', '2025-01-25'),
(4, 'February Specials', 'This month’s specials are here! Take advantage of exclusive deals and discounts. Sign up today to enjoy special rates!', '2025-02-01');


INSERT INTO Review (ReviewID, Content, Star, Date, AccountID, ProgramID)
VALUES
(1, 'This workshop was life-changing! I feel so much more confident speaking in front of others now.', 5, '2025-02-01', 1, 1),
(2, 'Fantastic program! The tips and techniques were extremely useful and easy to apply.', 5, '2025-02-01', 2, 1),
(3, 'I learned so much and improved my speaking skills drastically. Highly recommend to anyone looking to improve their communication!', 5, '2025-02-01', 3, 1),
(4, 'A really well-organized workshop! The instructors were engaging, and I left with a lot of useful skills for public speaking.', 5, '2025-02-01', 4, 1),
(5, 'This workshop helped me overcome my fear of public speaking. I’m now able to speak confidently in front of large groups!', 5, '2025-02-01', 5, 1),
(6, 'Incredible value! I now feel more comfortable in presentations and group discussions.', 5, '2025-02-01', 6, 1),
(7, 'I absolutely loved it! The exercises were practical and made a big difference in how I communicate.', 5, '2025-02-01', 7, 1),
(8, 'Such a great experience! I can now speak with confidence in front of my colleagues. Definitely worth attending!', 5, '2025-02-01', 8, 1),
(9, 'The public speaking techniques I learned were amazing. I feel so much more prepared for my next presentation!', 5, '2025-02-01', 9, 1),
(10, 'I’m so grateful for this workshop. It helped me work through my nerves and deliver a powerful speech.', 5, '2025-02-01', 10, 1),
(11, 'The feedback from the instructors was invaluable. I learned how to present my ideas clearly and confidently.', 5, '2025-02-01', 11, 1),
(12, 'A truly transformational experience! My communication skills have improved exponentially.', 5, '2025-02-01', 12, 1),
(13, 'The best public speaking workshop I’ve attended! I feel much more confident and prepared for future speaking engagements.', 5, '2025-02-01', 13, 1),
(14, 'I never thought I could be this confident speaking in front of people. This workshop was a game-changer!', 5, '2025-02-01', 14, 1),
(15, 'This program taught me so many useful techniques for engaging an audience. I can now deliver my speeches with ease!', 5, '2025-02-01', 15, 1),
(16, 'Amazing experience! I’ve learned so much about structuring my speeches and keeping the audience engaged.', 5, '2025-02-01', 16, 1),
(17, 'The PSLE camp was fantastic! It really helped my child with exam techniques and gave them the confidence to excel!', 5, '2025-01-15', 1, 2),
(18, 'I saw a significant improvement in my child’s performance after attending the PSLE camp. The teachers were very supportive!', 5, '2025-01-16', 2, 2);


INSERT INTO Ticketing (TicketID, AccountID, Category, Content, StartDate, Status)
VALUES
(1, 1, 'Payment', 'I cannot pay using PayNow.', '2025-01-18 10:00:00', 'Open'),
(2, 2, 'Technical', 'The system keeps crashing when I log in.', '2025-01-18 11:00:00', 'In Progress'),
(3, 3, 'General', 'I need help understanding the program schedule.', '2025-01-18 12:00:00', 'Resolved');

INSERT INTO Comments (CommentID, TicketID, CommenterID, IsAdmin, Content, CommentDate)
VALUES
-- Comments for Ticket 1
(1, 1, 2, TRUE, 'Don’t worry, we’ll check the issue with PayNow.', '2025-01-18 10:05:00'),
(2, 1, 1, FALSE, 'Thanks for the update! Please let me know ASAP.', '2025-01-18 10:10:00'),

-- Comments for Ticket 2
(3, 2, 3, FALSE, 'This issue happens on both mobile and desktop.', '2025-01-18 11:05:00'),
(4, 2, 2, TRUE, 'I’ll escalate this to the tech team for a deeper look.', '2025-01-18 11:15:00'),

-- Comments for Ticket 3
(5, 3, 3, FALSE, 'Can someone assist me with this?', '2025-01-18 12:05:00'),
(6, 3, 2, TRUE, 'The program schedule is available in your dashboard.', '2025-01-18 12:10:00');


INSERT INTO Forum (Topic) VALUES 
('Workshop'), 
('Camp'), 
('Lab');


INSERT INTO Thread (Title, Body, CreatedOn, Likes, SentimentValue, PostedBy, Topic, ReplyTo)
VALUES
    ('Workshop on Machine Learning', 'Hi all, what do those who have attended this workshop feel about it? Please comment under this thread and share with me thanks!', '2025-02-02', 10, 0.8, 1, 1, NULL),
    (NULL, 'I think this workshop is wonderful and you will not regret signing up for it!', '2025-02-02', 5, 0.9, 2, 1, 1),
    (NULL, 'Absolutely loved it! The content was so informative and the instructors were fantastic.', '2025-02-02', 6, 0.95, 3, 1, 1),
    (NULL, 'I gained so many valuable insights and learned practical skills that I can apply immediately.', '2025-02-02', 7, 0.85, 4, 1, 1),
    (NULL, 'I agree, this workshop exceeded my expectations. The hands-on exercises really helped solidify the concepts.', '2025-02-02', 8, 0.9, 5, 1, 1),
    (NULL, 'Great to hear all the positive feedback! I’m definitely signing up for the next session.', '2025-02-02', 4, 0.8, 6, 1, 1),
    ('Enquiry on Public Speaking workshop', 'Im interested in the public speaking workshops. Could someone please share with me the how the experience was like?', '2025-02-02', 3, 0.7, 7, 1, NULL),
    (NULL, 'I found the public speaking workshops to be incredibly helpful. I learned valuable techniques for structuring presentations, engaging the audience, and managing my nerves. The practical exercises and constructive feedback from the instructor were invaluable. Im already applying what I learned in my professional and personal life.', '2025-02-02', 8, 0.95, 8, 1, 7),
    (NULL, 'The workshops significantly boosted my confidence in public speaking. I used to dread presenting, but now I feel much more comfortable and prepared. The supportive environment and encouraging feedback from the instructor and fellow participants made a huge difference. I highly recommend these workshops to anyone looking to improve their public speaking skills.', '2025-02-02', 7, 0.85, 9, 1, 7),
    ('Camp for Young Speakers', 'Is anyone planning to join the Young Speakers camp? Would love to hear about past experiences!', '2025-02-03', 6, 0.8, 10, 2, NULL),
    (NULL, 'I attended the camp last year, and it was an amazing experience! I gained so much confidence and learned a lot about public speaking and presentation skills.', '2025-02-03', 9, 0.95, 11, 2, 10),
    (NULL, 'I went last summer, and the camp provided a great balance of learning and fun activities. Highly recommend it!', '2025-02-03', 8, 0.9, 12, 2, 10),
    (NULL, 'The camp was fantastic! The facilitators were supportive, and I felt like I made huge progress in my speaking abilities. Will definitely attend again.', '2025-02-03', 10, 0.92, 13, 2, 10),
    ('Lab Work Experience', 'Can anyone share their experience working at the Lab? Would be nice to know what to expect.', '2025-02-04', 4, 0.6, 14, 3, NULL),
    (NULL, 'I had a great time at the Lab! The hands-on work was really insightful, and I learned a lot. Definitely worth it!', '2025-02-04', 7, 0.8, 15, 3, 14),
    (NULL, 'The Lab was an incredible experience. It helped me understand the theoretical concepts in a more practical way. Highly recommend!', '2025-02-04', 6, 0.85, 16, 3, 14),
    ('Enquiry about PSLE Camp', 'Hi everyone, I’m looking into enrolling my child in the PSLE camp. Can anyone share their experience and how it helped with exam preparation?', '2025-02-01', 5, 0.7, 10, 2, NULL),
    (NULL, 'I enrolled my child last year, and the camp was really beneficial! It gave them a lot of practice and boosted their confidence for the exams.', '2025-02-02', 7, 0.8, 11, 1, 1),
    (NULL, 'The PSLE camp was great! My child really enjoyed the interactive lessons and the mock exams. Highly recommend it for anyone preparing for PSLE!', '2025-02-03', 6, 0.85, 12, 2, 1);


    INSERT INTO TransferRequest (SignUpID, NewSessionID, Reason, MCPath, Status)
VALUES
(1, 2, 'Medical Emergency', 'path/to/medical_certificate1.pdf', 'Pending'),
(2, 3, 'Schedule Conflict', 'path/to/medical_certificate2.pdf', 'Confirmed'),
(3, 4, 'Travel Issues', NULL, 'Pending'),
(4, 1, 'Personal Reasons', 'path/to/medical_certificate3.pdf', 'Confirmed');
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
BEFORE INSERT ON Tier
FOR EACH ROW
BEGIN
    SET NEW.DiscountedCost = NEW.Cost * 0.9;
END;
//
DELIMITER ;

-- Update Discount Cost on Update
DELIMITER //
CREATE TRIGGER update_discount_cost_on_update
BEFORE UPDATE ON Tier
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

DELIMITER //

CREATE TRIGGER reassign_session
AFTER UPDATE ON Session
FOR EACH ROW
BEGIN
    DECLARE v_NextSessionID INT;

    -- Check if the session status has changed to 'Cancelled'
    IF OLD.Status <> NEW.Status AND NEW.Status = 'Cancelled' THEN

        -- Call the procedure to get the next available session ID
        CALL GetNextSessionID(OLD.StartDate, OLD.TierID, v_NextSessionID);

        -- Update the SignUp table to reassign participants
        IF v_NextSessionID IS NOT NULL THEN
            UPDATE SignUp
            SET SessionID = v_NextSessionID
            WHERE SessionID = OLD.SessionID;
        ELSE
            -- Handle cases where no future session is available
            -- For example, you might want to notify administrators or log this event
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No future session available for reassignment';
        END IF;

    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE GetNextSessionID(
    IN p_StartDate DATE,
    IN p_TierID INT,
    OUT p_NextSessionID INT
)
BEGIN
    SELECT SessionID
    INTO p_NextSessionID
    FROM Session
    WHERE TierID = p_TierID AND StartDate > p_StartDate
    ORDER BY StartDate
    LIMIT 1;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DeleteTier(IN p_TierID INT)
BEGIN
    -- Delete associated entries in ProgramTier
    DELETE FROM ProgramTier 
    WHERE TierID = p_TierID;

    -- Delete the Tier
    DELETE FROM Tier 
    WHERE TierID = p_TierID;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE CreateTier(
	IN p_ProgramID INT,
	IN p_Name VARCHAR(100),
    IN p_ClassSize INT,
    IN p_Cost INT,
    IN p_DiscountedCost INT,
    IN p_LunchProvided BOOLEAN,
    IN p_Duration INT
)
BEGIN
    -- Insert a new Tier
    INSERT INTO Tier (Name, ClassSize, Cost, DiscountedCost, LunchProvided, Duration)
    VALUES (p_Name, p_ClassSize, p_Cost, p_DiscountedCost, p_LunchProvided, p_Duration);

    -- Get the newly inserted TierID
    SET @new_TierID := LAST_INSERT_ID();

    -- Insert a record into ProgramTier
    INSERT INTO ProgramTier (ProgramID, TierID)
    VALUES (p_ProgramID, @new_TierID); 
END //

DELIMITER ;
	ChildID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50),
    Strength VARCHAR(100),
    DOB DATE NOT NULL,
    Age INT NOT NULL DEFAULT 0,
    AccountID INT NOT NULL,
    SpecialLearningNeeds VARCHAR(255) DEFAULT NULL,
    DietaryRestrictions VARCHAR(255) DEFAULT NULL,
    Notes VARCHAR(255) DEFAULT NULL,

    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID)
);

CREATE TABLE ProgramType (
  TypeID INT PRIMARY KEY AUTO_INCREMENT,
  TypeDesc VARCHAR(50) NOT NULL
);

CREATE TABLE Program (
    ProgramID INT PRIMARY KEY AUTO_INCREMENT,
    ProgramName VARCHAR(50) NOT NULL,
    ProgramDesc VARCHAR(100) NOT NULL,
    TypeID INT NOT NULL,
    FOREIGN KEY (TypeID) REFERENCES ProgramType(TypeID)
);

CREATE TABLE Tier (
    TierID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    ClassSize INT NOT NULL,
    Cost INT NOT NULL,
    DiscountedCost INT NOT NULL DEFAULT 0,
    LunchProvided BOOLEAN,
    Duration INT NOT NULL
);

CREATE TABLE ProgramTier (
    ProgramID INT,
    TierID INT,
    PRIMARY KEY (ProgramID, TierID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ProgramID),
    FOREIGN KEY (TierID) REFERENCES Tier(TierID)
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
    Status ENUM('Active', 'Cancelled') NOT NULL DEFAULT 'Active',
    TierID INT NOT NULL,
    ProgramID INT NOT NULL,  -- 
    
    FOREIGN KEY (TierID) REFERENCES Tier(TierID),
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

CREATE TABLE Review (
	ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    Content VARCHAR(200) NOT NULL,
    Star INT NOT NULL,
    Date DATE NOT NULL,
    AccountID INT NOT NULL,
    ProgramID INT NOT NULL,
    
    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ProgramID)
);
CREATE TABLE TransferRequest (
    TransferID INT PRIMARY KEY AUTO_INCREMENT,
    SignUpID INT NOT NULL,
    NewSessionID INT NOT NULL,
    Reason VARCHAR(255) NOT NULL,
    MCPath TEXT NULL,
    RequestedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Confirmed') NOT NULL DEFAULT 'Pending',

    FOREIGN KEY (SignUpID) REFERENCES SignUp(SignUpID),
    FOREIGN KEY (NewSessionID) REFERENCES Session(SessionID)
);

CREATE TABLE Ticketing (
    TicketID INT PRIMARY KEY AUTO_INCREMENT,
    AccountID INT NOT NULL,
    Category ENUM('Payment', 'Technical', 'General', 'Other') NOT NULL,
    Content TEXT NOT NULL,
    StartDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    FOREIGN KEY (AccountID) REFERENCES Customer(AccountID)
);

CREATE TABLE Comments (
    CommentID INT PRIMARY KEY AUTO_INCREMENT,
    TicketID INT NOT NULL,
    CommenterID INT NOT NULL,
    IsAdmin BOOLEAN NOT NULL,
    Content TEXT NOT NULL,
    CommentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TicketID) REFERENCES Ticketing(TicketID) ON DELETE CASCADE
);

CREATE TABLE Forum (
	ForumID INT PRIMARY KEY AUTO_INCREMENT,
    Topic VARCHAR(100) NOT NULL 
);

CREATE TABLE Thread (
    ThreadID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(100) NULL,
    Body VARCHAR(500) NOT NULL,
    CreatedOn DATE NOT NULL,
    Likes INT NOT NULL DEFAULT 0,
    SentimentValue FLOAT NOT NULL,
    PostedBy INT NOT NULL,
    Topic INT NOT NULL,
    ReplyTo INT NULL,
    
    FOREIGN KEY (PostedBy) REFERENCES Customer(AccountID),
    FOREIGN KEY (Topic) REFERENCES Forum(ForumID),
    FOREIGN KEY (ReplyTo) REFERENCES Thread(ThreadID)
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
(6, 'Caden Toh', 'example@example.com', '10006000', FALSE, NULL, NULL, 'password123'),
(7, 'Sarah Lee', 'sarahlee@example.com', '98765432', TRUE, '2025-09-15', NULL, 'password567'),
(8, 'David Kim', 'davidkim@example.com', '87654321', FALSE, NULL, NULL, 'password678'),
(9, 'Emma Wilson', 'emmawilson@example.com', '76543210', TRUE, '2026-01-20', NULL, 'password789'),
(10, 'James Tan', 'jamestan@example.com', '65432109', FALSE, NULL, NULL, 'password890'),
(11, 'Olivia Chen', 'oliviachen@example.com', '54321098', TRUE, '2025-07-05', NULL, 'password901'),
(12, 'Ethan Wright', 'ethanwright@example.com', '43210987', FALSE, NULL, NULL, 'password012'),
(13, 'Charlotte Lim', 'charlottelim@example.com', '32109876', TRUE, '2024-11-22', NULL, 'password123'),
(14, 'Liam Koh', 'liamkoh@example.com', '21098765', TRUE, '2025-04-10', NULL, 'password234'),
(15, 'Sophia Ng', 'sophiang@example.com', '10987654', FALSE, NULL, NULL, 'password345'),
(16, 'Daniel Ong', 'danielong@example.com', '19876543', TRUE, '2026-02-28', NULL, 'password456');

INSERT INTO Admin (AdminID, Username, Password)
VALUES
(1, 'admin1', 'adminpassword1'),
(2, 'admin2', 'adminpassword2');

INSERT INTO Child (ChildID, Name, Strength, DOB, Age, AccountID, SpecialLearningNeeds, DietaryRestrictions, Notes)
VALUES
(1, 'Emily Doe', 'Swimming', '2012-08-15', 12, 1, 'Dyslexia', 'None', 'Emily is very enthusiastic about swimming. Needs additional support with reading instructions.'),
(2, 'Max Doe', 'Basketball', '2015-02-20', 9, 1, NULL, 'Peanut Allergy', 'Carries an EpiPen. Ensure no exposure to peanuts during events.'),
(3, 'Sophia Smith', 'Tennis', '2010-11-01', 14, 2, NULL, 'Vegetarian', 'Prefers not to eat meat. Ensure meal options are available.'),
(4, 'Oliver Johnson', 'Soccer', '2013-04-10', 11, 2, 'ADHD', NULL, 'Very energetic and needs frequent breaks. Responds well to structured activities.'),
(5, 'Ava Brown', 'Dancing', '2011-06-25', 13, 1, NULL, 'Lactose Intolerant', 'Avoid dairy products. Provide alternative milk if needed.'),
(6, 'Lucas Kim', 'Martial Arts', '2014-09-12', 10, 8, 'Mild Autism', 'None', 'Prefers a quiet environment. Ensure instructors give clear and direct instructions.'),
(7, 'Mia Wilson', 'Painting', '2016-05-30', 8, 9, NULL, 'Nut Allergy', 'Check all snacks for nut content. Keep emergency contacts updated.'),
(8, 'Noah Tan', 'Football', '2013-07-21', 11, 10, NULL, NULL, 'Shows great teamwork skills but needs encouragement in social interactions.'),
(9, 'Lily Chen', 'Gymnastics', '2015-02-17', 9, 11, 'Dyspraxia', NULL, 'May struggle with coordination but is eager to improve. Provide extra practice time.'),
(10, 'Benjamin Wright', 'Chess', '2012-12-09', 12, 12, NULL, 'Gluten-Free Diet', 'Ensure all meals and snacks meet dietary requirements.'),
(11, 'Zoe Lim', 'Ballet', '2014-03-22', 10, 13, 'Speech Delay', NULL, 'Prefers non-verbal communication. Encourage participation through gestures.'),
(12, 'Nathan Koh', 'Running', '2011-10-18', 13, 14, NULL, NULL, 'Very competitive but gets discouraged easily. Needs positive reinforcement.'),
(13, 'Ella Ng', 'Singing', '2016-07-05', 8, 15, 'Mild Anxiety', 'None', 'May get nervous in large groups. Allow extra time to settle in before activities.'),
(14, 'Ryan Ong', 'Cycling', '2013-08-29', 11, 16, NULL, 'Shellfish Allergy', 'Avoid any seafood exposure. Parents provided emergency medication.'),
(15, 'Hannah Ong', 'Piano', '2015-11-15', 9, 16, 'Dyslexia', 'None', 'Struggles with reading sheet music but has excellent musical memory. Provide extra verbal instructions.');

INSERT INTO ProgramType (TypeID, TypeDesc)
VALUES
(1, 'Workshop'),
(2, 'Camps'),
(3, 'Labs'),
(4, 'Professional');

INSERT INTO Tier (Name, ClassSize, Cost, DiscountedCost, LunchProvided, Duration) 
VALUES 
('Beginner', 15, 788, 709.2, TRUE, 8),
('Intermediate', 10, 988, 889.2, TRUE, 15),
('Advanced', 10, 1388, 1249.2, TRUE, 10),
('PSLE Power Up', 15, 388, 349.2, FALSE, 20),
('PSLE Chinese Oral Booster', 10, 488, 439.2, FALSE, 15); 

INSERT INTO Program (ProgramName, ProgramDesc, TypeID)
VALUES
('Public Speaking Workshop', 'Learn the basics of public speaking', 1),
('PSLE Power Up Camp - PSLE Power Up', 'Comprehensive PSLE revision', 2);

INSERT INTO ProgramTier 
VALUES
	(1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5);

INSERT INTO Webinar (WebinarName, WebinarDesc, Link, Date, StartTime, EndTime, Speaker)
VALUES
('Mastering Python', 'Learn the fundamentals of Python programming', 'https://www.python.org/about/gettingstarted/', '2024-11-13', '10:00:00', '12:00:00', 'Dr. Python'),
('Data Science 101', 'Introduction to data science concepts and tools', 'https://www.datasciencecentral.com/', '2024-11-20', '13:30:00', '15:30:00', 'Prof. Data'),
('Web Development Workshop', 'Build dynamic web applications with HTML, CSS, and JavaScript', 'https://www.w3schools.com/', '2024-11-27', '09:00:00', '11:00:00', 'Mr. Web'),
('AI and Machine Learning', 'Explore the world of artificial intelligence and machine learning', 'https://www.machinelearningmastery.com/', '2024-12-04', '14:00:00', '16:00:00', 'Ms. AI'),
('Cybersecurity Basics', 'Learn how to protect your digital assets', 'https://www.cybersecurityventures.com/', '2024-12-11', '11:00:00', '13:00:00', 'Captain Cyber');

INSERT INTO Session (StartDate, EndDate, Time, Location, Vacancy, Status, TierID, ProgramID) VALUES
('2025-02-10', '2025-02-11', '10:00:00', 'Auditorium A', 15, 'Active', 1, 1),  -- Beginner - Public Speaking Workshop
('2025-02-15', '2025-02-16', '14:00:00', 'Classroom B', 15, 'Active', 1, 1),
('2025-02-20', '2025-02-21', '10:00:00', 'Auditorium C', 10, 'Active', 2, 1),  -- Intermediate - Public Speaking Workshop
('2025-02-25', '2025-02-26', '14:00:00', 'Classroom D', 10, 'Active', 2, 1),
('2025-03-01', '2025-03-02', '10:00:00', 'Auditorium E', 10, 'Active', 3, 1),  -- Advanced - Public Speaking Workshop
('2025-03-05', '2025-03-06', '14:00:00', 'Classroom F', 10, 'Active', 3, 1),
('2025-03-10', '2025-03-11', '10:00:00', 'Auditorium G', 15, 'Active', 4, 2),  -- PSLE Power Up - PSLE Camp
('2025-03-15', '2025-03-16', '14:00:00', 'Classroom H', 15, 'Active', 4, 2),
('2025-03-20', '2025-03-21', '10:00:00', 'Auditorium I', 10, 'Active', 5, 2),  -- PSLE Chinese Oral Booster - PSLE Camp
('2025-03-25', '2025-03-26', '14:00:00', 'Classroom J', 10, 'Active', 5, 2);


INSERT INTO Lunch (LunchOptionID, LunchDesc)
VALUES
(1, 'Veggie Wrap'),
(2, 'Chicken Sandwich'),
(3, 'Fruit Salad'),
(4, 'Turkey Burger'),
(5, 'Pasta Bowl');

INSERT INTO SignUp (SignUpID, AccountID, SessionID, LunchOptionID, ChildID)
VALUES
(1, 1, 1, 1, 1),
(2, 1, 2, 2, 2),
(3, 2, 2, 3, 3),
(4, 2, 3, 4, 4),
(5, 1, 4, 1, 5),
(6, 8, 5, 2, 6),
(7, 9, 6, 1, 7),
(8, 10, 1, 5, 8),
(9, 11, 2, 3, 9),
(10, 12, 3, 4, 10),
(11, 13, 4, 3, 11),
(12, 14, 5, 2, 12),
(13, 15, 6, 1, 13),
(14, 16, 1, 5, 14),
(15, 16, 2, 1, 15),
(16, 1, 8, 1, 1),
(17, 1, 8, 1, 2),
(18, 2, 8, 1, 3),
(19, 2, 7, 1, 4),
(20, 1, 7, 1, 5);


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
(2, 93157026, 788, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157026.pdf', 2, 1, NULL, NULL),
(3, 67491350, 788, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491350.pdf', 2, 2, 1, 'Approved by Admin 1'),
(4, 28653104, 988, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653104.pdf', 3, 2, NULL, NULL),
(5, 67491351, 988, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491351.pdf', 4, 1, 1, 'Approved by Admin 2'),
(6, 93157027, 1388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157027.pdf', 5, 8, NULL, NULL),
(7, 28653105, 1388, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653105.pdf', 6, 9, NULL, NULL),
(8, 67491352, 788, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491352.pdf', 1, 10, 1, 'Approved by Admin 3'),
(9, 93157028, 788, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157028.pdf', 2, 11, NULL, NULL),
(10, 28653106, 988, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653106.pdf', 3, 12, NULL, NULL),
(11, 67491353, 988, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491353.pdf', 4, 13, 1, 'Approved by Admin 4'),
(12, 93157029, 1388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157029.pdf', 5, 14, NULL, NULL),
(13, 28653107, 1388, '2024-10-20 12:00:00', 'Pending', 'path/to/invoice-28653107.pdf', 6, 15, NULL, NULL),
(14, 67491354, 788, '2024-10-15 12:00:00', 'Approved', 'path/to/invoice-67491354.pdf', 1, 16, 1, 'Approved by Admin 5'),
(15, 93157030, 788, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 2, 16, NULL, NULL),
(16, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 8, 1, NULL, NULL),
(17, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 8, 1, NULL, NULL),
(18, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 8, 2, NULL, NULL),
(19, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 7, 2, NULL, NULL),
(20, 93157030, 388, '2024-10-10 12:00:00', 'Pending', 'path/to/invoice-93157030.pdf', 7, 1, NULL, NULL);

INSERT INTO Announcement (AnnouncementID, Title, Body, PostedDate)
VALUES 
(1, 'Happy New Year!', 'Wishing all our customers a fantastic New Year! Get ready for a fresh start with exciting new programs and promotions ahead!', '2025-01-01'),
(2, 'Chinese New Year Promotions', 'Celebrate Chinese New Year with us! We are rolling out special discounts and packages for this festive season. Stay tuned for more details!', '2025-01-29'),
(3, 'Exciting Programs for the Year Ahead', 'Start the year strong with our newly launched programs! Check out our updated lineup and enroll now for early-bird offers!', '2025-01-25'),
(4, 'February Specials', 'This month’s specials are here! Take advantage of exclusive deals and discounts. Sign up today to enjoy special rates!', '2025-02-01');


INSERT INTO Review (ReviewID, Content, Star, Date, AccountID, ProgramID)
VALUES
(1, 'This workshop was life-changing! I feel so much more confident speaking in front of others now.', 5, '2025-02-01', 1, 1),
(2, 'Fantastic program! The tips and techniques were extremely useful and easy to apply.', 5, '2025-02-01', 2, 1),
(3, 'I learned so much and improved my speaking skills drastically. Highly recommend to anyone looking to improve their communication!', 5, '2025-02-01', 3, 1),
(4, 'A really well-organized workshop! The instructors were engaging, and I left with a lot of useful skills for public speaking.', 5, '2025-02-01', 4, 1),
(5, 'This workshop helped me overcome my fear of public speaking. I’m now able to speak confidently in front of large groups!', 5, '2025-02-01', 5, 1),
(6, 'Incredible value! I now feel more comfortable in presentations and group discussions.', 5, '2025-02-01', 6, 1),
(7, 'I absolutely loved it! The exercises were practical and made a big difference in how I communicate.', 5, '2025-02-01', 7, 1),
(8, 'Such a great experience! I can now speak with confidence in front of my colleagues. Definitely worth attending!', 5, '2025-02-01', 8, 1),
(9, 'The public speaking techniques I learned were amazing. I feel so much more prepared for my next presentation!', 5, '2025-02-01', 9, 1),
(10, 'I’m so grateful for this workshop. It helped me work through my nerves and deliver a powerful speech.', 5, '2025-02-01', 10, 1),
(11, 'The feedback from the instructors was invaluable. I learned how to present my ideas clearly and confidently.', 5, '2025-02-01', 11, 1),
(12, 'A truly transformational experience! My communication skills have improved exponentially.', 5, '2025-02-01', 12, 1),
(13, 'The best public speaking workshop I’ve attended! I feel much more confident and prepared for future speaking engagements.', 5, '2025-02-01', 13, 1),
(14, 'I never thought I could be this confident speaking in front of people. This workshop was a game-changer!', 5, '2025-02-01', 14, 1),
(15, 'This program taught me so many useful techniques for engaging an audience. I can now deliver my speeches with ease!', 5, '2025-02-01', 15, 1),
(16, 'Amazing experience! I’ve learned so much about structuring my speeches and keeping the audience engaged.', 5, '2025-02-01', 16, 1),
(17, 'The PSLE camp was fantastic! It really helped my child with exam techniques and gave them the confidence to excel!', 5, '2025-01-15', 1, 2),
(18, 'I saw a significant improvement in my child’s performance after attending the PSLE camp. The teachers were very supportive!', 5, '2025-01-16', 2, 2);


INSERT INTO Ticketing (TicketID, AccountID, Category, Content, StartDate, Status)
VALUES
(1, 1, 'Payment', 'I cannot pay using PayNow.', '2025-01-18 10:00:00', 'Open'),
(2, 2, 'Technical', 'The system keeps crashing when I log in.', '2025-01-18 11:00:00', 'In Progress'),
(3, 3, 'General', 'I need help understanding the program schedule.', '2025-01-18 12:00:00', 'Resolved');

INSERT INTO Comments (CommentID, TicketID, CommenterID, IsAdmin, Content, CommentDate)
VALUES
-- Comments for Ticket 1
(1, 1, 2, TRUE, 'Don’t worry, we’ll check the issue with PayNow.', '2025-01-18 10:05:00'),
(2, 1, 1, FALSE, 'Thanks for the update! Please let me know ASAP.', '2025-01-18 10:10:00'),

-- Comments for Ticket 2
(3, 2, 3, FALSE, 'This issue happens on both mobile and desktop.', '2025-01-18 11:05:00'),
(4, 2, 2, TRUE, 'I’ll escalate this to the tech team for a deeper look.', '2025-01-18 11:15:00'),

-- Comments for Ticket 3
(5, 3, 3, FALSE, 'Can someone assist me with this?', '2025-01-18 12:05:00'),
(6, 3, 2, TRUE, 'The program schedule is available in your dashboard.', '2025-01-18 12:10:00');


INSERT INTO Forum (Topic) VALUES 
('Workshop'), 
('Camp'), 
('Lab');


INSERT INTO Thread (Title, Body, CreatedOn, Likes, SentimentValue, PostedBy, Topic, ReplyTo)
VALUES
    ('Workshop on Machine Learning', 'Hi all, what do those who have attended this workshop feel about it? Please comment under this thread and share with me thanks!', '2025-02-02', 10, 0.8, 1, 1, NULL),
    (NULL, 'I think this workshop is wonderful and you will not regret signing up for it!', '2025-02-02', 5, 0.9, 2, 1, 1),
    (NULL, 'Absolutely loved it! The content was so informative and the instructors were fantastic.', '2025-02-02', 6, 0.95, 3, 1, 1),
    (NULL, 'I gained so many valuable insights and learned practical skills that I can apply immediately.', '2025-02-02', 7, 0.85, 4, 1, 1),
    (NULL, 'I agree, this workshop exceeded my expectations. The hands-on exercises really helped solidify the concepts.', '2025-02-02', 8, 0.9, 5, 1, 1),
    (NULL, 'Great to hear all the positive feedback! I’m definitely signing up for the next session.', '2025-02-02', 4, 0.8, 6, 1, 1),
    ('Enquiry on Public Speaking workshop', 'Im interested in the public speaking workshops. Could someone please share with me the how the experience was like?', '2025-02-02', 3, 0.7, 7, 1, NULL),
    (NULL, 'I found the public speaking workshops to be incredibly helpful. I learned valuable techniques for structuring presentations, engaging the audience, and managing my nerves. The practical exercises and constructive feedback from the instructor were invaluable. Im already applying what I learned in my professional and personal life.', '2025-02-02', 8, 0.95, 8, 1, 7),
    (NULL, 'The workshops significantly boosted my confidence in public speaking. I used to dread presenting, but now I feel much more comfortable and prepared. The supportive environment and encouraging feedback from the instructor and fellow participants made a huge difference. I highly recommend these workshops to anyone looking to improve their public speaking skills.', '2025-02-02', 7, 0.85, 9, 1, 7),
    ('Camp for Young Speakers', 'Is anyone planning to join the Young Speakers camp? Would love to hear about past experiences!', '2025-02-03', 6, 0.8, 10, 2, NULL),
    (NULL, 'I attended the camp last year, and it was an amazing experience! I gained so much confidence and learned a lot about public speaking and presentation skills.', '2025-02-03', 9, 0.95, 11, 2, 10),
    (NULL, 'I went last summer, and the camp provided a great balance of learning and fun activities. Highly recommend it!', '2025-02-03', 8, 0.9, 12, 2, 10),
    (NULL, 'The camp was fantastic! The facilitators were supportive, and I felt like I made huge progress in my speaking abilities. Will definitely attend again.', '2025-02-03', 10, 0.92, 13, 2, 10),
    ('Lab Work Experience', 'Can anyone share their experience working at the Lab? Would be nice to know what to expect.', '2025-02-04', 4, 0.6, 14, 3, NULL),
    (NULL, 'I had a great time at the Lab! The hands-on work was really insightful, and I learned a lot. Definitely worth it!', '2025-02-04', 7, 0.8, 15, 3, 14),
    (NULL, 'The Lab was an incredible experience. It helped me understand the theoretical concepts in a more practical way. Highly recommend!', '2025-02-04', 6, 0.85, 16, 3, 14),
    ('Enquiry about PSLE Camp', 'Hi everyone, I’m looking into enrolling my child in the PSLE camp. Can anyone share their experience and how it helped with exam preparation?', '2025-02-01', 5, 0.7, 10, 2, NULL),
    (NULL, 'I enrolled my child last year, and the camp was really beneficial! It gave them a lot of practice and boosted their confidence for the exams.', '2025-02-02', 7, 0.8, 11, 1, 1),
    (NULL, 'The PSLE camp was great! My child really enjoyed the interactive lessons and the mock exams. Highly recommend it for anyone preparing for PSLE!', '2025-02-03', 6, 0.85, 12, 2, 1);


    INSERT INTO TransferRequest (SignUpID, NewSessionID, Reason, MCPath, Status)
VALUES
(1, 2, 'Medical Emergency', 'path/to/medical_certificate1.pdf', 'Pending'),
(2, 3, 'Schedule Conflict', 'path/to/medical_certificate2.pdf', 'Confirmed'),
(3, 4, 'Travel Issues', NULL, 'Pending'),
(4, 1, 'Personal Reasons', 'path/to/medical_certificate3.pdf', 'Confirmed');
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
BEFORE INSERT ON Tier
FOR EACH ROW
BEGIN
    SET NEW.DiscountedCost = NEW.Cost * 0.9;
END;
//
DELIMITER ;

-- Update Discount Cost on Update
DELIMITER //
CREATE TRIGGER update_discount_cost_on_update
BEFORE UPDATE ON Tier
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

DELIMITER //

CREATE TRIGGER reassign_session
AFTER UPDATE ON Session
FOR EACH ROW
BEGIN
    DECLARE v_NextSessionID INT;

    -- Check if the session status has changed to 'Cancelled'
    IF OLD.Status <> NEW.Status AND NEW.Status = 'Cancelled' THEN

        -- Call the procedure to get the next available session ID
        CALL GetNextSessionID(OLD.StartDate, OLD.TierID, v_NextSessionID);

        -- Update the SignUp table to reassign participants
        IF v_NextSessionID IS NOT NULL THEN
            UPDATE SignUp
            SET SessionID = v_NextSessionID
            WHERE SessionID = OLD.SessionID;
        ELSE
            -- Handle cases where no future session is available
            -- For example, you might want to notify administrators or log this event
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No future session available for reassignment';
        END IF;

    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE GetNextSessionID(
    IN p_StartDate DATE,
    IN p_TierID INT,
    OUT p_NextSessionID INT
)
BEGIN
    SELECT SessionID
    INTO p_NextSessionID
    FROM Session
    WHERE TierID = p_TierID AND StartDate > p_StartDate
    ORDER BY StartDate
    LIMIT 1;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DeleteTier(IN p_TierID INT)
BEGIN
    -- Delete associated entries in ProgramTier
    DELETE FROM ProgramTier 
    WHERE TierID = p_TierID;

    -- Delete the Tier
    DELETE FROM Tier 
    WHERE TierID = p_TierID;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE CreateTier(
	IN p_ProgramID INT,
	IN p_Name VARCHAR(100),
    IN p_ClassSize INT,
    IN p_Cost INT,
    IN p_DiscountedCost INT,
    IN p_LunchProvided BOOLEAN,
    IN p_Duration INT
)
BEGIN
    -- Insert a new Tier
    INSERT INTO Tier (Name, ClassSize, Cost, DiscountedCost, LunchProvided, Duration)
    VALUES (p_Name, p_ClassSize, p_Cost, p_DiscountedCost, p_LunchProvided, p_Duration);

    -- Get the newly inserted TierID
    SET @new_TierID := LAST_INSERT_ID();

    -- Insert a record into ProgramTier
    INSERT INTO ProgramTier (ProgramID, TierID)
    VALUES (p_ProgramID, @new_TierID); 
END //

DELIMITER ;