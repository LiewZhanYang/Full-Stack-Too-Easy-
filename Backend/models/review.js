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