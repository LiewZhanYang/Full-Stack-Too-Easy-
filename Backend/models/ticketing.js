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
    const formattedDate = new Date(ticketDetails.StartDate)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

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
      return {
        TicketID: result.insertId,
        ...ticketDetails,
        StartDate: formattedDate,
      };
    } catch (error) {
      console.error("Error inserting ticket:", error);
      connection.end();
      throw error;
    }
  }

  static async getTickets() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `SELECT * FROM Ticketing WHERE Status IN ('Open', 'In Progress', 'Resolved')`;
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

  static async addComment(ticketID, content, commenterID, isAdmin = 0) {
    let connection;

    try {
      // Establish a database connection
      connection = await mysql.createConnection(dbConfig);

      // Insert the comment into the database
      const sqlQuery = `
        INSERT INTO Comments (TicketID, Content, CommenterID, IsAdmin, CommentDate) 
        VALUES (?, ?, ?, ?, NOW())
      `;
      const [result] = await connection.execute(sqlQuery, [
        ticketID,
        content, // Pass the content properly
        commenterID, // Pass the commenter ID properly
        isAdmin, // Pass the admin flag properly
      ]);

      // Return the inserted comment
      return {
        CommentID: result.insertId,
        TicketID: parseInt(ticketID),
        Content: content,
        CommenterID: commenterID,
        IsAdmin: isAdmin,
        CommentDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error adding comment in model:", error);
      throw error; // Rethrow the error for the controller to handle
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  static async getComments(ticketID) {
    let connection;

    try {
      // Establish a database connection
      connection = await mysql.createConnection(dbConfig);

      // SQL query to fetch comments by ticket ID
      const sqlQuery = `
        SELECT CommentID, TicketID, Content, CommenterID, IsAdmin, CommentDate
        FROM Comments
        WHERE TicketID = ?
        ORDER BY CommentDate ASC
      `;
      const [comments] = await connection.execute(sqlQuery, [ticketID]);

      return comments; // Return the list of comments
    } catch (error) {
      console.error("Error fetching comments in model:", error);
      throw error; // Rethrow error for the controller to handle
    } finally {
      if (connection) {
        await connection.end(); // Ensure the connection is closed
      }
    }
  }
}

module.exports = Ticketing;
