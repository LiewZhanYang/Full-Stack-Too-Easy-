const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class TransferRequest {
  // Create a new transfer request
  static async createTransferRequest(signUpID, newSessionID, reason, mcPath) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      INSERT INTO TransferRequest (SignUpID, NewSessionID, Reason, MCPath)
      VALUES (?, ?, ?, ?);
    `;
    const [result] = await connection.execute(sqlQuery, [
      signUpID,
      newSessionID,
      reason,
      mcPath,
    ]);
    return result.insertId; // Return the ID of the new request
  }

  // Get all transfer requests
  static async getAllTransferRequests() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT 
          tr.TransferID, 
          tr.SignUpID, 
          tr.NewSessionID, 
          s1.StartDate AS CurrentSessionStart, 
          s2.StartDate AS NewSessionStart, 
          tr.Reason, 
          tr.MCPath, 
          tr.RequestedAt
      FROM TransferRequest tr
      JOIN Session s1 ON tr.SignUpID = s1.SessionID
      JOIN Session s2 ON tr.NewSessionID = s2.SessionID;
    `;
    const [result] = await connection.execute(sqlQuery);
    return result;
  }

  // Get a specific transfer request
  static async getTransferRequestById(transferID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `SELECT * FROM TransferRequest WHERE TransferID = ?;`;
    const [result] = await connection.execute(sqlQuery, [transferID]);
    return result[0] || null;
  }

  // Delete transfer request
  static async deleteTransferRequest(transferID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `DELETE FROM TransferRequest WHERE TransferID = ?;`;
    const [result] = await connection.execute(sqlQuery, [transferID]);
    return result.affectedRows > 0;
  }
}

module.exports = TransferRequest;
