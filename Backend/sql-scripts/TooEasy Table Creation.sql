SELECT * FROM Session;
SELECT * FROM SignUp

SELECT SessionID
FROM Session
WHERE ProgramID = 1 AND StartDate > '2025-02-04'
LIMIT 1;

SELECT SessionID
FROM Session
WHERE p_ProgramID AND StartDate > p_StartDate
LIMIT 1;

USE TooEasyDB;
SELECT * FROM Program;
SELECT * FROM ProgramTier;
SELECT * FROM Tier;
SELECT * FROM Session;
SELECT * FROM SignUp;

SELECT t.*
FROM Program p
JOIN ProgramTier pt ON p.ProgramID = pt.ProgramID
JOIN Tier t ON pt.TierID = t.TierID
WHERE p.ProgramID = 1;

CALL DeleteTier(1);
CALL CreateTier(1, "Something", 15, 340,400,TRUE, 10);

Use tooeasydb;
select * from session;

SELECT current_date()

SELECT * FROM Thread;

SELECT * FROM Program WHERE ProgramID IN (
SELECT ProgramID FROM Session 
WHERE SessionID IN (SELECT SessionID FROM SignUp WHERE AccountID = 1));