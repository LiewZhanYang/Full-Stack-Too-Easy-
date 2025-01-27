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


  static async getTicketById(ticketID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `SELECT * FROM Ticketing WHERE TicketID = ?`;
    const [result] = await connection.execute(sqlQuery, [ticketID]);
    connection.end();
    return result[0]; // Return the first result (or null if not found)
  }

  static async postTicket(ticketDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
      INSERT INTO Ticketing (AccountID, Category, Content, StartDate, Status)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Convert StartDate to MySQL DATETIME format
    const formattedDate = new Date(ticketDetails.StartDate).toISOString().slice(0, 19).replace('T', ' ');

    const values = [
      ticketDetails.AccountID,
      ticketDetails.Category,
      ticketDetails.Content,
      formattedDate,
      ticketDetails.Status || "Open",
    ];

    try {
      const [result] = await connection.execute(sqlQuery, values);
      connection.end();
      return { TicketID: result.insertId, ...ticketDetails, StartDate: formattedDate };
    } catch (error) {
      console.error("Error inserting ticket:", error);
      connection.end();
      throw error;
    }
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
