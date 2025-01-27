const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Session {
  constructor(
    SessionID,
    StartDate,
    EndDate,
    Time,
    Location,
    Vacancy,
    Status,
    TierID
  ) {
    this.SessionID = SessionID;
    this.StartDate = StartDate;
    this.EndDate = EndDate;
    this.Time = Time;
    this.Location = Location;
    this.Vacancy = Vacancy;
    this.Status = Status;
    this.TierID = TierID;
  }

  static async getSessionsByTierID(TierID) {
    const connection = await mysql.createConnection(dbConfig);
    console.log(`Executing query for TierID: ${TierID}`);
    const sqlQuery = `
        SELECT * FROM session WHERE TierID = ? AND StartDate > CURDATE()
    `;
    const [result] = await connection.execute(sqlQuery, [TierID]);
    console.log(`Query result:`, result);
    connection.end();
    return result.map((row) => {
      return new Session(
        row.SessionID,
        row.StartDate,
        row.EndDate,
        row.Time,
        row.Location,
        row.Vacancy,
        row.Status,
        row.TierID
      );
    });
  }

  static async postSession(sessionDetails) {
    const connection = await mysql.createConnection(dbConfig);

    // Validate input
    if (
      !sessionDetails.StartDate ||
      !sessionDetails.EndDate ||
      !sessionDetails.Time ||
      !sessionDetails.Location ||
      !sessionDetails.Vacancy ||
      !sessionDetails.TierID
    ) {
      throw new Error("Missing required session details");
    }

    const sqlQuery = `
        INSERT INTO session (StartDate, EndDate, Time, Location, Vacancy, TierID)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      sessionDetails.StartDate,
      sessionDetails.EndDate,
      sessionDetails.Time,
      sessionDetails.Location,
      sessionDetails.Vacancy,
      sessionDetails.TierID,
    ];

    try {
      const [result] = await connection.execute(sqlQuery, values);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      connection.end();
      throw error;
    }
  }

  static async updateSession(SessionID, SessionDetails) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
            UPDATE session 
            SET StartDate = ?, EndDate = ?, Time = ?, Location = ?, Status = ?
            WHERE sessionID = ?
        `;

    const values = [
      SessionDetails.StartDate,
      SessionDetails.EndDate,
      SessionDetails.Time,
      SessionDetails.Location,
      SessionDetails.Status,
      SessionID,
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();

    return result.affectedRows > 0; // Return true if the signup was updated
  }

  static async deleteSession(SessionID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            DELETE FROM session WHERE SessionID = ?;`;

    const [result] = await connection.execute(sqlQuery, [SessionID]);
    connection.end();
  }

  static async getSessionBySessionID(sessionID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
          SELECT * FROM session WHERE SessionID = ?
        `;
    const [result] = await connection.execute(sqlQuery, [sessionID]);

    connection.end();

    if (result.length === 0) {
      return null; // No session found with that ID
    }

    const row = result[0];
    return new Session(
      row.SessionID,
      row.StartDate,
      row.EndDate,
      row.Time,
      row.Location,
      row.Vacancy,
      row.Status,
      row.TierID
    );
  }
}

module.exports = Session;
