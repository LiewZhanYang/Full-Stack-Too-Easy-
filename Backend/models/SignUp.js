const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class signup {
  constructor(SignUpID, AccountID, SessionID, LunchOptionID, ChildID) {
    this.SignUpID = SignUpID;
    this.AccountID = AccountID;
    this.SessionID = SessionID;
    this.LunchOptionID = LunchOptionID;
    this.ChildID = ChildID;
  }

  // Retrieve all signups
  static async getAllSignUps() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
            SELECT * FROM SignUp
        `;

    const [result] = await connection.execute(sqlQuery);
    connection.end();

    return result.map(
      (row) =>
        new SignUp(
          row.SignUpID,
          row.AccountID,
          row.SessionID,
          row.LunchOptionID,
          row.ChildID
        )
    );
  }

  // Create a new signup
  static async postSignUp(signUpDetails) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
            INSERT INTO SignUp (AccountID, SessionID, LunchOptionID, ChildID)
            VALUES (?, ?, ?, ?)
        `;

    const values = [
      signUpDetails.AccountID,
      signUpDetails.SessionID,
      signUpDetails.LunchOptionID,
      signUpDetails.ChildID,
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();

    return result.insertId; // Return the ID of the newly created signup
  }

  // Retrieve a signup by ID
  static async getSignUpById(signUpID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
            SELECT * FROM SignUp WHERE SignUpID = ?
        `;

    const [result] = await connection.execute(sqlQuery, [signUpID]);
    connection.end();

    if (result.length > 0) {
      const row = result[0];
      return new SignUp(
        row.SignUpID,
        row.AccountID,
        row.SessionID,
        row.LunchOptionID,
        row.ChildID
      );
    }
    return null; // Return null if no signup found
  }

  // Update a signup
  static async updateSignUp(signUpID, signUpDetails) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
            UPDATE SignUp 
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
            DELETE FROM SignUp WHERE SignUpID = ?
        `;

    const [result] = await connection.execute(sqlQuery, [signUpID]);
    connection.end();

    return result.affectedRows > 0; // Return true if the signup was deleted
  }
}

module.exports = signup;
