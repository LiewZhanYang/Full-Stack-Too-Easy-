const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');

class Child {
    constructor(ChildID, Name, Strength, DOB, AccountID){
        this.ChildID = ChildID;
        this.Name = Name;
        this.Strength = Strength;
        this.DOB = DOB;
        this.AccountID = AccountID;
    }

    static async getChildByAccountID(AccountID) {
        const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT * FROM Child WHERE AccountID = ?
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
        const sqlQuery = `
            INSERT INTO Child (Name, Strength, DOB, AccountID)
            VALUES (?, ?, ?, ?)`;

        const values = [
            childDetails.Name, 
            childDetails.Strength,
            childDetails.DOB,
            childDetails.AccountID
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }

    static async deleteChild(id) {
        const connection = await mysql.createConnection(dbConfig);
        const deleteSignUpQuery = `
            DELETE FROM SignUp WHERE ChildID = ?;`;
        const deleteChildQuery = `
            DELETE FROM Child WHERE ChildID = ?;`;
        const [result] = await connection.execute(deleteSignUpQuery, [id]);
        const [result1] = await connection.execute(deleteChildQuery, [id]);
        connection.end();
    }

    static async updateChild(id, childDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            UPDATE Child
            SET Name = ?, Strength = ?, DOB = ?
            WHERE ChildID = ?`;

        const values = [
            childDetails.Name, 
            childDetails.Strength,
            childDetails.DOB,
            id
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }
}

module.exports = Child