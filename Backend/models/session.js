const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Session {
  constructor(SessionID, Date, Time, Location, ProgramID) {
    this.SessionID = SessionID;
    this.Date = Date;
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
    return result.map((row) => {
      return new Session(
        row.SessionID,
        row.Date,
        row.Time,
        row.Location,
        row.ProgramID
      );
    });
  }

  static async postSession(sessionDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            INSERT INTO Session (Date, Time, Location, ProgramID)
            VALUES (?, ?, ?, ?)`;

    const values = [
      sessionDetails.Date,
      sessionDetails.Time,
      sessionDetails.Location,
      sessionDetails.ProgramID,
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
  }

  // Get a session by its ID
  static async getSessionBySessionID(sessionID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT * FROM Session WHERE SessionID = ?
    `;
    const [result] = await connection.execute(sqlQuery, [sessionID]);

    connection.end();

    if (result.length === 0) {
      return null; // No session found with that ID
    }

    const row = result[0];
    return new Session(
      row.SessionID,
      row.SessionName,
      row.SessionDate,
      row.SessionTime,
      row.ProgramID
    );
  }
}

module.exports = Session;
