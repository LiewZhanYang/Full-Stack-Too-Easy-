const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');
const Admin = require('./admin');

class Payment {
    constructor(OrderID, InvoiceID, Amount, CreatedAt, ApprovedStatus, InvoicePath, SessionID, PaidBy, Reason, ApprovedBy) {
        this.OrderID = OrderID;
        this.InvoiceID = InvoiceID;
        this.Amount = Amount;
        this.CreatedAt = CreatedAt;
        this.ApprovedStatus = ApprovedStatus;
        this.InvoicePath = InvoicePath;
        this.SessionID = SessionID;
        this.PaidBy = PaidBy;
        this.Reason = Reason;
        this.ApprovedBy = ApprovedBy;
    }

    static async getAllPayment() {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM Payment
        `;
        const [result] = await connection.execute(sqlQuery);

        connection.end();
        return result.map(row => {
            return new Payment(
            row.OrderID,
            row.InvoiceID, 
            row.Amount,
            row.CreatedAt,
            row.ApprovedStatus,
            row.InvoicePath,
            row.SessionID,
            row.PaidBy,
            row.Reason,
            row.ApprovedBy
        )});        
    }

    static async postPayment(id, paymentDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            INSERT INTO Payment (InvoiceID, Amount, CreatedAt, ApprovedStatus, InvoicePath, SessionID, PaidBy, ApprovedBy, Reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        const values = [
            paymentDetails.InvoiceID,
            paymentDetails.Amount,
            paymentDetails.CreatedAt,
            paymentDetails.ApprovedStatus,
            paymentDetails.InvoicePath,
            paymentDetails.SessionID, 
            id, 
            paymentDetails.ApprovedBy,
            paymentDetails.Reason
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }

    static async approvePayment(OrderID, AdminID) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            UPDATE Payment
            SET ApprovedStatus = 1, ApprovedBy = ?
            WHERE OrderID = ?`;
        const values = [
            AdminID.AdminID, 
            OrderID
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }

    static async rejectPayment(OrderID, rejectDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            UPDATE Payment
            SET Reason = ?, ApprovedBy = ?
            WHERE OrderID = ?`;
        const values = [
            rejectDetails.Reason,
            rejectDetails.AdminID,
            OrderID
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }
}

module.exports = Payment;