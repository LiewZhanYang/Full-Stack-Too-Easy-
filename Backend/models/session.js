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

  static async getSessionsByProgramAndTier(programId, tierName) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT s.* 
        FROM Session s
        JOIN Tier t ON s.TierID = t.TierID
        JOIN ProgramTier pt ON t.TierID = pt.TierID
        WHERE pt.ProgramID = ? AND t.Name = ?
        AND s.StartDate > CURDATE() -- Ensure only upcoming sessions are shown
    `;

    try {
      console.log(
        `Executing query for Program ID: ${programId}, Tier: ${tierName}`
      );
      const [result] = await connection.execute(sqlQuery, [
        programId,
        tierName,
      ]);
      console.log(`Query result:`, result);
      return result;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    } finally {
      connection.end();
    }
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
    const { StartDate, EndDate, Time, Location, Vacancy, TierID, ProgramID } =
      sessionDetails;

    console.log("Received session details:", sessionDetails); // Debugging line

    if (
      !StartDate ||
      !EndDate ||
      !Time ||
      !Location ||
      !Vacancy ||
      !TierID ||
      !ProgramID
    ) {
      console.error("Error: Missing required fields!", sessionDetails);
      return { error: "All fields are required." };
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      const [tierExists] = await connection.execute(
        "SELECT TierID FROM Tier WHERE TierID = ?",
        [TierID]
      );
      if (tierExists.length === 0) {
        console.error("Error: Invalid TierID", TierID);
        return { error: "Invalid TierID. No such tier exists." };
      }

      const [programExists] = await connection.execute(
        "SELECT ProgramID FROM Program WHERE ProgramID = ?",
        [ProgramID]
      );
      if (programExists.length === 0) {
        console.error("Error: Invalid ProgramID", ProgramID);
        return { error: "Invalid ProgramID. No such program exists." };
      }

      console.log(
        "Executing SQL Insert with values:",
        StartDate,
        EndDate,
        Time,
        Location,
        Vacancy,
        TierID,
        ProgramID
      );

      const sqlQuery = `
        INSERT INTO Session (StartDate, EndDate, Time, Location, Vacancy, Status, TierID, ProgramID)
        VALUES (?, ?, ?, ?, ?, 'Active', ?, ?)
      `;
      const values = [
        StartDate,
        EndDate,
        Time,
        Location,
        Vacancy,
        TierID,
        ProgramID,
      ];

      const [result] = await connection.execute(sqlQuery, values);
      connection.end();

      return {
        message: "Session created successfully",
        sessionID: result.insertId,
      };
    } catch (error) {
      console.error("Error inserting session:", error);
      connection.end();
      throw new Error("Error creating session");
    }
  }

  static async updateSession(SessionID, SessionDetails) {
    const connection = await mysql.createConnection(dbConfig);

    // Set default values if not provided
    const status = SessionDetails.Status || "Active";

    const sqlQuery = `
      UPDATE session 
      SET StartDate = ?, EndDate = ?, Time = ?, Location = ?, Vacancy = ?, Status = ?
      WHERE SessionID = ?
    `;

    const values = [
      SessionDetails.StartDate,
      SessionDetails.EndDate,
      SessionDetails.Time,
      SessionDetails.Location,
      SessionDetails.Vacancy,
      status,
      SessionID,
    ];

    try {
      console.log("Session Details:", SessionDetails);
      console.log("Executing SQL Query:", sqlQuery);
      console.log("With values:", values);

      const [result] = await connection.execute(sqlQuery, values);
      console.log("Update result:", result);
      return result.affectedRows > 0; // Return true if the session was updated
    } catch (error) {
      console.error("Error updating session:", error);
      throw error; // Rethrow the error after logging it
    } finally {
      await connection.end(); // Ensure the connection is closed
    }
  }

  static async deleteSession(SessionID) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Check for related payments
      const checkQuery = `SELECT * FROM payment WHERE SessionID = ?`;
      const [relatedPayments] = await connection.execute(checkQuery, [
        SessionID,
      ]);

      if (relatedPayments.length > 0) {
        throw new Error(
          "Cannot delete session. Payments are associated with this session."
        );
      }

      // Proceed with deletion if no related payments
      const deleteQuery = `DELETE FROM session WHERE SessionID = ?;`;
      const [result] = await connection.execute(deleteQuery, [SessionID]);

      return result.affectedRows > 0; // Return true if the session was deleted
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    } finally {
      connection.end();
    }
  }

  static async getSessionBySessionID(sessionID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
    SELECT 
      s.*, 
      t.Name AS TierName 
    FROM 
      Session s
    JOIN 
      Tier t 
    ON 
      s.TierID = t.TierID
    WHERE 
      s.SessionID = ?
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
