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

    static async updateSession(SessionID, SessionDetails) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
            UPDATE Session 
            SET StartDate = ?, EndDate = ?, Time = ?, Location = ?
            WHERE SessionID = ?
        `;

        const values = [
            SessionDetails.StartDate,
            SessionDetails.EndDate,
            SessionDetails.Time,
            SessionDetails.Location,
            SessionID
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();

        return result.affectedRows > 0; // Return true if the signup was updated
    }

    static async deleteSession(SessionID) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            DELETE FROM Session WHERE SessionID = ?;`;

        const [result] = await connection.execute(sqlQuery, [SessionID]);
        connection.end();
    }
}

module.exports = Session