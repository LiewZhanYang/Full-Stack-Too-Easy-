const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Workshop {
  static async getMostPopularWorkshop() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT 
            t.Name AS WorkshopName,
            t.Duration AS WorkshopDuration,
            COUNT(su.SignUpID) AS TotalSignups
        FROM 
            SignUp su
        JOIN 
            Session s ON su.SessionID = s.SessionID
        JOIN 
            Tier t ON s.TierID = t.TierID
        WHERE 
            s.StartDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY 
            t.TierID, t.Name, t.Duration
        ORDER BY 
            TotalSignups DESC
        LIMIT 3;
        `;

    const [result] = await connection.execute(sqlQuery);
    return result[0] || null; // Return the most popular workshop or null if none found
  }

  static async getAverageRatingByWorkshop(id) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            SELECT ROUND(SUM(Star) / COUNT(*), 1) AS AverageStarRating
            FROM Review
            WHERE ProgramID = ?;
        `;

    const [result] = await connection.execute(sqlQuery, [id]);
    return result[0] || null; // Return the most popular workshop or null if none found
  }

  static async getTotalForumEngagement() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            SELECT COUNT(*) AS TotalEngagement FROM Thread
            WHERE CreatedOn = CURDATE();
        `;

    const [result] = await connection.execute(sqlQuery);
    connection.end();

    return result[0] || { TotalEngagement: 0 };
  }
}

module.exports = Workshop;
