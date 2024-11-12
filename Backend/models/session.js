const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');

class Session {
    constructor(SessionID, StartDate, EndDate, Time, Location, ProgramID) {
        this.SessionID = SessionID;
        this.StartDate = StartDate;
        this.EndDate = EndDate;
        this.Time = Time;
        this.Location = Location;
        this.ProgramID = ProgramID;
    }

    static async getSessionsByProgramID(ProgramID) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM Session WHERE ProgramID = ?
        `;
        const [result] = await connection.execute(sqlQuery, [ProgramID]);

        connection.end();
        return result.map(row => {
            return new Session(
            row.SessionID,
            row.StartDate,
            row.EndDate, 
            row.Time,
            row.Location,
            row.ProgramID
        )});
    }

    static async postSession(sessionDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            INSERT INTO Session (StartDate, EndDate, Time, Location, ProgramID)
            VALUES (?, ?, ?, ?, ?)`;

        const values = [
            sessionDetails.StartDate,
            sessionDetails.EndDate, 
            sessionDetails.Time,
            sessionDetails.Location,
            sessionDetails.ProgramID
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();        
    }
}

module.exports = Session