const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');

class Booking {
    constructor(BookingID, Time, Date, AccountID){
        this.BookingID = BookingID;
        this.Time = Time;
        this.Date = Date;
        this.AccountID = AccountID;
    }

    static async getBookingByAccountID(id) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM Booking WHERE AccountID = ?
        `;
        const [result] = await connection.execute(sqlQuery, [id]);

        connection.end();
        return result.map(row => {
            return new Booking(
            row.BookingID,
            row.Time, 
            row.Date,
            row.AccountID
        )});
    }

    static async postBooking(bookingDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            INSERT INTO Booking (Time, Date, AccountID)
            VALUES (?, ?, ?)`;

        const values = [
            bookingDetails.Time,
            bookingDetails.Date,
            bookingDetails.AccountID
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
}

module.exports = Booking