const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');

class Child {
    constructor(ChildID, Name, Strength, DOB, Age, AccountID){
        this.ChildID = ChildID;
        this.Name = Name;
        this.Strength = Strength;
        this.DOB = DOB;
        this.Age = Age;
        this.AccountID = AccountID;
    }

    static async getChildByAccountID(AccountID) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM child WHERE AccountID = ?
        `;
        const [result] = await connection.execute(sqlQuery, [AccountID]);

        connection.end();
        return result.map(row => {
            return new Child(
            row.ChildID,
            row.Name, 
            row.Strength,
            row.DOB,
            row.AccountID
        )});
    } 

    static async postChild(childDetails) {
        const connection = await mysql.createConnection(dbConfig);
    
        // Format the DOB to remove time and timezone
        const formattedDOB = new Date(childDetails.DOB).toISOString().slice(0, 10); // Extracts YYYY-MM-DD
    
        const sqlQuery = `
            INSERT INTO child (Name, Strength, DOB, Age, AccountID)
            VALUES (?, ?, ?, ?, ?)`;
    
        const values = [
            childDetails.Name,
            childDetails.Strength,
            formattedDOB,  // Use the formatted date
            childDetails.Age,
            childDetails.AccountID
        ];
    
        try {
            console.log("Attempting to insert child with details:", values);  // Log the values being inserted
            const [result] = await connection.execute(sqlQuery, values);
            console.log("Child inserted successfully with ID:", result.insertId);  // Log success message
    
            connection.end();
            return { id: result.insertId };  // Return inserted ID for confirmation
        } catch (error) {
            console.error("Error inserting child into database. Details:", error);
    
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error("Foreign key constraint failed: Ensure AccountID exists in the referenced table.");
            } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
                console.error("Data type mismatch: Check that DOB, Age, and AccountID are correctly formatted.");
            } else {
                console.error("Unknown error occurred while inserting child.");
            }
            throw error;  // Re-throw error after logging
        } finally {
            if (connection) connection.end();
        }
    }
    

    static async deleteChild(id) {
        const connection = await mysql.createConnection(dbConfig);
        const deleteSignUpQuery = `
            DELETE FROM signUp WHERE childID = ?;`;
        const deleteChildQuery = `
            DELETE FROM child WHERE childID = ?;`;
        const [result] = await connection.execute(deleteSignUpQuery, [id]);
        const [result1] = await connection.execute(deleteChildQuery, [id]);
        connection.end();
    }

    static async updateChild(id, childDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            UPDATE child
            SET Name = ?, Strength = ?, DOB = ?
            WHERE childID = ?`;

        const values = [
            childDetails.Name, 
            childDetails.Strength,
            childDetails.DOB,
            id
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }

    static async getChildBySessionID(id) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM Child WHERE ChildID IN (
        SELECT ChildID FROM SignUp WHERE SessionID = ?)
        `;
        const [result] = await connection.execute(sqlQuery, [id]);

        connection.end();
        return result.map(row => {
            return new Child(
            row.ChildID,
            row.Name, 
            row.Strength,
            row.DOB,
            row.AccountID
        )});
    }
}

module.exports = Child