const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Comments {
  constructor(CommentID, TicketID, CommenterID, IsAdmin, Content, CommentDate) {
    this.CommentID = CommentID;
    this.TicketID = TicketID;
    this.CommenterID = CommenterID;
    this.IsAdmin = IsAdmin;
    this.Content = Content;
    this.CommentDate = CommentDate;
  }

  static async postComment(commentDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
      INSERT INTO Comments (TicketID, CommenterID, IsAdmin, Content, CommentDate)
      VALUES (?, ?, ?, ?, ?)`;

    const values = [
      commentDetails.TicketID,
      commentDetails.CommenterID,
      commentDetails.IsAdmin,
      commentDetails.Content,
      commentDetails.CommentDate || new Date(),
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
    return { CommentID: result.insertId, ...commentDetails };
  }

  static async getCommentsByTicketID(ticketID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `SELECT * FROM Comments WHERE TicketID = ?`;
    const [result] = await connection.execute(sqlQuery, [ticketID]);
    connection.end();
    return result;
  }
}

module.exports = Comments;
