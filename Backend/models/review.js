const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Review {
    constructor(
        ReviewID, 
        Content, 
        Star, 
        Date, 
        AccountID,
        ProgramID
    ) {
        this.ReviewID = ReviewID;
        this.Content = Content;
        this.Star = Star;
        this.Date = Date;
        this.AccountID = AccountID;
        this.ProgramID = ProgramID;
    }
    static async getProgramIDFromReview(accountID) {
        const connection = await mysql.createConnection(dbConfig);
        try {
            const sqlQuery = `
                SELECT r.ReviewID, r.Content, r.Star, r.Date, r.AccountID, p.ProgramID
                FROM Review r
                JOIN Program p ON r.ProgramID = p.ProgramID
                WHERE r.AccountID = ?
                ORDER BY r.Date DESC
                LIMIT 1; -- Get the latest review
            `;

            const [result] = await connection.execute(sqlQuery, [accountID]);
            connection.end();

            if (result.length === 0) {
                return null; // No review found
            }

            return result[0]; // Return the latest review with ProgramID
        } catch (error) {
            console.error("Error fetching ProgramID from reviews:", error);
            throw error;
        }
    }
    
    static async getReviewsByProgram(ID) {
        const connection = await mysql.createConnection(dbConfig);
    
        const sqlQuery = `
          SELECT * FROM Review WHERE ProgramID = ?;
        `;
        const [result] = await connection.execute(sqlQuery, [ID]);
    
        connection.end();
        return result.map((row) => {
            return new Review(
                row.ReviewID,
                row.Content, 
                row.Star,
                row.Date, 
                row.AccountID,
                row.ProgramID
            );
        });
    }

    static async postReview(reviewDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            INSERT INTO Review (Content, Star, Date, AccountID, ProgramID)
            VALUES (?, ?, CURDATE(), ?, ?)`;

        const values = [
            reviewDetails.Content, 
            reviewDetails.Star, 
            reviewDetails.AccountID,
            reviewDetails.ProgramID
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }
}

module.exports = Review;