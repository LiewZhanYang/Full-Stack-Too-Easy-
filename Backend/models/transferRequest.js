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
  static async updateMCPath(transferID, mcPath) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      UPDATE TransferRequest 
      SET MCPath = ? 
      WHERE TransferID = ?;
    `;
    const [result] = await connection.execute(sqlQuery, [mcPath, transferID]);

    return result.affectedRows > 0; // Returns true if update was successful
  }
  // Get all transfer requests
  static async getAllTransferRequests() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT 
    tr.TransferID,
    su.AccountID,
    p.ProgramName,
    tr.Reason,
    tr.MCPath,
    tr.RequestedAt,
    tr.Status
FROM 
    TransferRequest tr
JOIN 
    SignUp su ON tr.SignUpID = su.SignUpID
JOIN 
    Program p ON su.SessionID = p.ProgramID;

    `;
    const [result] = await connection.execute(sqlQuery);
    return result;
  }

  // Get a specific transfer request
  static async getTransferRequestById(transferID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = ` SELECT 
      tr.TransferID,
      su.AccountID,
      p.ProgramName,
      tr.Reason,
      tr.MCPath,
      tr.RequestedAt,
      tr.Status
    FROM 
      TransferRequest tr
    JOIN 
      SignUp su ON tr.SignUpID = su.SignUpID
    JOIN 
      Program p ON su.SessionID = p.ProgramID
    WHERE 
      tr.TransferID = ?;`;
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

  static async updateTransferRequestStatus(transferID, status) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `UPDATE TransferRequest SET Status = ? WHERE TransferID = ?`;
    const [result] = await connection.execute(sqlQuery, [status, transferID]);
    return result.affectedRows > 0; // Return true if the update was successful
  }
}

module.exports = TransferRequest;
