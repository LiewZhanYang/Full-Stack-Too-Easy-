const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Signup {
  constructor(SignUpID, AccountID, SessionID, LunchOptionID, ChildID, TierID) {
    this.SignUpID = SignUpID;
    this.AccountID = AccountID;
    this.SessionID = SessionID;
    this.LunchOptionID = LunchOptionID;
    this.ChildID = ChildID;
    this.TierID = TierID;
  }

  // Retrieve all signups
  static async getAllSignUps() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `SELECT * FROM signup`;
    const [result] = await connection.execute(sqlQuery);
    connection.end();

    return result.map(
      (row) =>
        new Signup(
          row.SignUpID,
          row.AccountID,
          row.SessionID,
          row.LunchOptionID,
          row.ChildID,
          row.TierID
        )
    );
  }

  static async postSignUp(signUpDetails) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      INSERT INTO signup (AccountID, SessionID, LunchOptionID, ChildID)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      signUpDetails.AccountID,
      signUpDetails.SessionID,
      signUpDetails.LunchOptionID,
      signUpDetails.ChildID,
    ];

    try {
      console.log("Executing query:", sqlQuery);
      console.log("With values:", values);

      const [result] = await connection.execute(sqlQuery, values);
      console.log("Query result:", result);

      connection.end();

      return result.insertId; // Return the ID of the newly created signup
    } catch (error) {
      console.error("Database error during signup creation:", error.message);
      connection.end();
      throw error; // Rethrow to be caught in the controller
    }
  }

  static async getSignUpById(accountID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `SELECT * FROM signup WHERE AccountID = ?`;
    console.log("Executing query:", sqlQuery, "With AccountID:", accountID); // Debugging
    const [result] = await connection.execute(sqlQuery, [accountID]);
    connection.end();

    console.log("Query Result:", result); // Debug log

    return result.map(
      (row) =>
        new Signup(
          row.SignUpID,
          row.AccountID,
          row.SessionID,
          row.LunchOptionID,
          row.ChildID,
          row.TierID
        )
    );
  }

  // Update a signup
  static async updateSignUp(signUpID, signUpDetails) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      UPDATE signup 
      SET AccountID = ?, SessionID = ?, LunchOptionID = ?, ChildID = ?
      WHERE SignUpID = ?
    `;

    const values = [
      signUpDetails.AccountID,
      signUpDetails.SessionID,
      signUpDetails.LunchOptionID,
      signUpDetails.ChildID,
      signUpID,
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();

    return result.affectedRows > 0; // Return true if the signup was updated
  }

  // Delete a signup
  static async deleteSignUp(signUpID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      DELETE FROM signup WHERE SignUpID = ?
    `;

    const [result] = await connection.execute(sqlQuery, [signUpID]);
    connection.end();

    return result.affectedRows > 0; // Return true if the signup was deleted
  }

  // Retrieve top 5 threads by forum engagement
  static async getTopThreads() {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);

      const query = `
          SELECT 
            t.ThreadID,
            COALESCE(t.Title, 'Untitled Thread') AS Title,
            t.Likes,
            COUNT(r.ThreadID) AS Replies,
            (t.Likes + COUNT(r.ThreadID)) AS TotalEngagement
          FROM 
            Thread t
          LEFT JOIN 
            Thread r ON r.ReplyTo = t.ThreadID
          GROUP BY 
            t.ThreadID
          ORDER BY 
            TotalEngagement DESC
          LIMIT 5;
        `;

      const [rows] = await connection.execute(query);

      return rows;
    } catch (error) {
      console.error("Error fetching top threads:", error.message);
      throw error; 
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }
}

module.exports = Signup;
