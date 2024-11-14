const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Booking {
  constructor(BookingID, StartTime, EndTime, Date, URL, AccountID) {
    this.BookingID = BookingID;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
    this.Date = Date;
    this.URL = URL;
    this.AccountID = AccountID;
  }

  static async getAllBooking() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Booking
        `;
    const [result] = await connection.execute(sqlQuery);

    connection.end();
    return result.map((row) => {
      return new Booking(
        row.BookingID,
        row.StartTime,
        row.EndTime,
        row.Date,
        row.URL,
        row.AccountID
      );
    });
  }

  static async getBookingByAccountID(id) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Booking WHERE AccountID = ? AND Date > CURDATE()
        `;
    const [result] = await connection.execute(sqlQuery, [id]);

    connection.end();
    return result.map((row) => {
      return new Booking(
        row.BookingID,
        row.StartTime,
        row.EndTime,
        row.Date,
        row.URL,
        row.AccountID
      );
    });
  }

  static async postBooking(bookingDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            INSERT INTO Booking (StartTime, EndTime, Date, URL, AccountID)
            VALUES (?, ?, ?, ?, ?)`;

    const values = [
      bookingDetails.StartTime,
      bookingDetails.EndTime,
      bookingDetails.Date,
      bookingDetails.URL || null,
      bookingDetails.AccountID,
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
  }

  static async deleteBookingByBookingID(id) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            DELETE FROM Booking WHERE BookingID = ?;`;
    const [result] = await connection.execute(sqlQuery, [id]);
    connection.end();
  }

  static async updateMeetingUrlByBookingID(bookingID, URL) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      UPDATE Booking
      SET URL = ?
      WHERE BookingID = ?
    `;

    try {
      const [result] = await connection.execute(sqlQuery, [URL, bookingID]);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error updating booking URL:", error);
      connection.end();
      throw error;
    }
  }
}

module.exports = Booking;
