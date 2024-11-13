const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');

class Announcement {
    constructor(AnnouncementID, Title, Body, PostedDate){
        this.AnnouncementID = AnnouncementID;
        this.Title = Title;
        this.Body = Body;
        this.PostedDate = PostedDate;
    }

    static async getAllAnnouncementByID(id) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM Announcement WHERE AnnouncementID = ?
        `;

        const [result] = await connection.execute(sqlQuery, [id]);

        connection.end();
        return result.map(row => {
            return new Announcement(
            row.AnnouncementID,
            row.Title, 
            row.Body, 
            row.PostedDate
        )});       
    }

    static async getAllAnnouncement() {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
        SELECT * FROM Announcement
        `;
        const [result] = await connection.execute(sqlQuery);

        connection.end();
        return result.map(row => {
            return new Announcement(
                row.AnnouncementID,
                row.Title, 
                row.Body, 
                row.PostedDate
        )});       
    }

    static async updateAnnouncement(id, updateData) {
        const connection = await mysql.createConnection(dbConfig);
    
        // Construct the SQL query dynamically based on updateData keys
        const fields = Object.keys(updateData)
            .map((field) => `${field} = ?`)
            .join(", ");
        const values = Object.values(updateData);
        values.push(id); // Add the ID at the end for the WHERE clause
    
        const sqlQuery = `
            UPDATE Announcement
            SET ${fields}
            WHERE AnnouncementID = ?
        `;
    
        try {
            const [result] = await connection.execute(sqlQuery, values);
            connection.end();
            return result;
        } catch (error) {
            console.error("Error updating Announcement:", error);
            connection.end();
            throw error;
        }
    }

    static async postAnnouncement(announcementDetails) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
            INSERT INTO Announcement (Title, Body, PostedDate)
            VALUES (?, ?, CURDATE())
        `;

        const values = [
            announcementDetails.Title, 
            announcementDetails.Body
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end()     
    }

    static async deleteAnnouncement(id) {
        const connection = await mysql.createConnection(dbConfig);

        const sqlQuery = `
            DELETE FROM Announcement WHERE AnnouncementID = ?;`;

        const [result] = await connection.execute(sqlQuery, [id]);
        connection.end();
    }
}

module.exports = Announcement