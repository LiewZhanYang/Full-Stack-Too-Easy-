const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Booking {
  constructor(BookingID, Time, Date, URL, AccountID) {
    this.BookingID = BookingID;
    this.Time = Time;
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
        row.Time,
        row.Date,
        row.URL,
        row.AccountID
      );
    });
  }

  static async getBookingByAccountID(id) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Booking WHERE AccountID = ?
        `;
    const [result] = await connection.execute(sqlQuery, [id]);

    connection.end();
    return result.map((row) => {
      return new Booking(
        row.BookingID,
        row.Time,
        row.Date,
        row.URL,
        row.AccountID
      );
    });
  }

  static async postBooking(bookingDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            INSERT INTO Booking (Time, Date, URL, AccountID)
            VALUES (?, ?, ?)`;

    const values = [
      bookingDetails.Time,
      bookingDetails.Date,
      bookingDetails.URL,
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

  static async addMeetingUrl(id, updateData) {
    const connection = await mysql.createConnection(dbConfig);

    const fields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updateData);
    values.push(id); // Add the BookingID for the WHERE clause

    const sqlQuery = `
        UPDATE Booking
        SET ${fields}
        WHERE BookingID = ?
    `;

    try {
      const [result] = await connection.execute(sqlQuery, values);
      console.log("Database Update Result:", result); // Added for debugging
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
