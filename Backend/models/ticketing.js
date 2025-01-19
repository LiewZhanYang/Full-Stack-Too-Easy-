const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Ticketing {
  constructor(TicketID, AccountID, Category, Content, StartDate, Status) {
    this.TicketID = TicketID;
    this.AccountID = AccountID;
    this.Category = Category;
    this.Content = Content;
    this.StartDate = StartDate;
    this.Status = Status;
  }

  static async postTicket(ticketDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
      INSERT INTO Ticketing (AccountID, Category, Content, StartDate, Status)
      VALUES (?, ?, ?, ?, ?)`;

    const values = [
      ticketDetails.AccountID,
      ticketDetails.Category,
      ticketDetails.Content,
      ticketDetails.StartDate || new Date(),
      ticketDetails.Status || "Open",
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
    return { TicketID: result.insertId, ...ticketDetails };
  }

  static async getTickets() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `SELECT * FROM Ticketing`;
    const [result] = await connection.execute(sqlQuery);
    connection.end();
    return result;
  }

  static async updateTicketStatus(ticketID, newStatus) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
      UPDATE Ticketing
      SET Status = ?
      WHERE TicketID = ?`;
  
    const values = [newStatus, ticketID];
  
    try {
      const [result] = await connection.execute(sqlQuery, values);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      connection.end();
      throw error;
    }
  }
  
}

module.exports = Ticketing;
