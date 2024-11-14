const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Payment {
  constructor(
    OrderID,
    InvoiceID,
    Amount,
    CreatedAt,
    Status,
    InvoicePath,
    SessionID,
    PaidBy,
    Reason,
    ApprovedBy,
    Name,
    ContactNo,
    ProgramID
  ) {
    this.OrderID = OrderID;
    this.InvoiceID = InvoiceID;
    this.Amount = Amount;
    this.CreatedAt = CreatedAt;
    this.Status = Status;
    this.InvoicePath = InvoicePath;
    this.SessionID = SessionID;
    this.PaidBy = PaidBy;
    this.Reason = Reason;
    this.ApprovedBy = ApprovedBy;
    this.Name = Name;
    this.ContactNo = ContactNo;
  }

  static async getAllPayment() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Payment
        `;
    const [result] = await connection.execute(sqlQuery);

    connection.end();
    return result.map((row) => {
      return new Payment(
        row.OrderID,
        row.InvoiceID,
        row.Amount,
        row.CreatedAt,
        row.Status,
        row.InvoicePath,
        row.SessionID,
        row.PaidBy,
        row.Reason,
        row.ApprovedBy,
        null,
        null
      );
    });
  }

  static async postPayment(paymentDetails) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);

      const sqlQuery = `
        INSERT INTO Payment (InvoiceID, Amount, CreatedAt, Status, InvoicePath, SessionID, PaidBy, ApprovedBy, Reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const values = [
        paymentDetails.InvoiceID,
        paymentDetails.Amount,
        paymentDetails.CreatedAt,
        paymentDetails.Status,
        paymentDetails.InvoicePath,
        paymentDetails.SessionID,
        paymentDetails.PaidBy,
        paymentDetails.ApprovedBy,
        paymentDetails.Reason,
      ];

      // For Darling Leong Kai Jie
      //const file = paymentDetails.File;
      //console.log(file);

      // Execute the query and log the result
      const [result] = await connection.execute(sqlQuery, values);
      console.log("Insert result:", result);

      // Check if insertId is available
      if (!result.insertId) {
        throw new Error("No order ID generated");
      }

      return { OrderID: result.insertId };
    } catch (error) {
      console.error(
        "Error posting payment to the database:",
        error.sqlMessage || error.message
      );
      throw error;
    } finally {
      if (connection) connection.end();
    }
  }

  static async approvePayment(OrderID, ApproveDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            UPDATE Payment
            SET Status = 'Approved', ApprovedBy = ?
            WHERE OrderID = ?`;
    const values = [ApproveDetails.AdminID, OrderID];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
  }

  static async rejectPayment(OrderID, rejectDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            UPDATE Payment
            SET Status = 'Rejected', Reason = ?, ApprovedBy = ?
            WHERE OrderID = ?`;
    const values = [rejectDetails.Reason, rejectDetails.AdminID, OrderID];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
  }

  static async getPaymentById(orderID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            SELECT p.*, c.Name, c.ContactNo FROM Payment p 
            INNER JOIN Customer c ON p.PaidBy = c.AccountID
            WHERE p.OrderID = ?
        `;
    const [result] = await connection.execute(sqlQuery, [orderID]);
    connection.end();

    if (result.length > 0) {
      const row = result[0];
      return new Payment(
        row.OrderID,
        row.InvoiceID,
        row.Amount,
        row.CreatedAt,
        row.Status,
        row.InvoicePath,
        row.SessionID,
        row.PaidBy,
        row.Reason,
        row.ApprovedBy,
        row.Name,
        row.ContactNo
      );
    } else {
      return null; // Return null if no payment is found with the given ID
    }
  }
}

module.exports = Payment;
