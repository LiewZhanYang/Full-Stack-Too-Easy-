const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');

class Program {
    constructor(ProgramID, ProgrameName, Cost, TypeID) {
        this.ProgramID = ProgramID;
        this.ProgrameName = ProgrameName;
        this.Cost = Cost;
        this.TypeID = TypeID;
    }

    static async getAllPrograms() {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM Program
        `;
        const [result] = await connection.execute(sqlQuery);

        connection.end();
        return result.map(row => {
            return new Program(
            row.ProgramID,
            row.ProgramName, 
            row.Cost,
            row.TypeID
        )});
    }

    static async postProgram(programDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            INSERT INTO Program (ProgramName, Cost, TypeID)
            VALUES (?, ?, ?)`;

        const values = [
            programDetails.ProgramName, 
            programDetails.Cost,
            programDetails.TypeID
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }
}

module.exports = Program