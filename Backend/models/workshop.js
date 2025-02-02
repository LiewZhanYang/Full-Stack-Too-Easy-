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
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);

      const sqlQuery = `
        SELECT 
          c.AccountID,
          c.Name AS CustomerName,
          COUNT(t.ThreadID) AS TotalThreads,
          SUM(CASE WHEN t.ReplyTo IS NOT NULL THEN 1 ELSE 0 END) AS TotalReplies,
          (COUNT(t.ThreadID) + SUM(CASE WHEN t.ReplyTo IS NOT NULL THEN 1 ELSE 0 END)) AS TotalEngagement
        FROM 
          Customer c
        LEFT JOIN 
          Thread t ON c.AccountID = t.PostedBy
        GROUP BY 
          c.AccountID
        ORDER BY 
          TotalEngagement DESC
        LIMIT 5;
      `;

      const [result] = await connection.execute(sqlQuery);

      return result; // Return the top forum engagement by customers
    } catch (error) {
      console.error(
        "Error fetching top forum engagement by customers:",
        error.message
      );
      throw error; // Rethrow the error for the caller to handle
    } finally {
      if (connection) {
        await connection.end(); // Ensure the connection is closed
      }
    }
  }
}

module.exports = Workshop;
