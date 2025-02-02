const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Program {
  constructor(ProgramID, ProgramName, ProgramDesc, TypeID) {
    this.ProgramID = ProgramID;
    this.ProgramName = ProgramName;
    this.ProgramDesc = ProgramDesc;
    this.TypeID = TypeID;
  }

  // Get program by ID
  static async getProgramById(id) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT * FROM program WHERE ProgramID = ?
    `;
    const [rows] = await connection.execute(sqlQuery, [id]);
    connection.end();

    if (rows.length === 0) {
      return null; // Return null if no program found with the given ID
    }

    const row = rows[0];
    return new Program(
      row.ProgramID,
      row.ProgramName,
      row.ProgramDesc,
      row.TypeID
    );
  }

  // Get program by Tier ID
  static async getProgramByTier(tierID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT ProgramID FROM ProgramTier 
        WHERE TierID = ?;
    `;
    const [rows] = await connection.execute(sqlQuery, [tierID]);
    connection.end();

    if (rows.length === 0) {
      return null; // Return null if no program found for this TierID
    }

    return rows.map((row) => row.ProgramID); // Return list of ProgramIDs
  }

  // Get program by signup
  static async getProgramBySignUp(AccountID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT * FROM Program WHERE ProgramID IN (
        SELECT ProgramID FROM Session 
        WHERE SessionID IN (SELECT SessionID FROM SignUp WHERE AccountID = ?));
    `;
    const [rows] = await connection.execute(sqlQuery, [AccountID]);
    connection.end();

    if (rows.length === 0) {
      return null; // Return null if no program found with the given ID
    }

    return rows.map((row) => {
      return new Program(
        row.ProgramID,
        row.ProgramName,
        row.ProgramDesc,
        row.TypeID
      );
    });
  }

  // Get all programs
  static async getAllPrograms() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM program
        `;
    const [result] = await connection.execute(sqlQuery);

    connection.end();
    return result.map((row) => {
      return new Program(
        row.ProgramID,
        row.ProgramName,
        row.ProgramDesc,
        row.TypeID
      );
    });
  }

  // Get programs by type
  static async getProgramsByType(typeID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
      SELECT * FROM program WHERE TypeID = ?
    `;
    const [rows] = await connection.execute(sqlQuery, [typeID]);
    connection.end();

    if (rows.length === 0) {
      return [];
    }

    return rows.map((row) => {
      return new Program(
        row.ProgramID,
        row.ProgramName,
        row.ProgramDesc,
        row.TypeID
      );
    });
  }

  // Post a new program
  static async postProgram(programDetails) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      const sqlQuery = `
      INSERT INTO program (ProgramName, ProgramDesc, TypeID)
      VALUES (?, ?, ?)
    `;
      const values = [
        programDetails.ProgramName,
        programDetails.ProgramDesc,
        programDetails.TypeID,
      ];

      const [result] = await connection.execute(sqlQuery, values);

      // Return the generated ProgramID
      return { ProgramID: result.insertId };
    } catch (error) {
      console.error("Error creating new program:", error);
      throw error;
    } finally {
      if (connection) connection.end();
    }
  }

  // Update a program
  static async updateProgram(id, updateData) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);

      // Remove any keys that should not be part of the database update
      const filteredUpdateData = { ...updateData };
      delete filteredUpdateData.file; // Remove 'file' key if it exists

      // Check if there are any fields to update
      if (!filteredUpdateData || Object.keys(filteredUpdateData).length === 0) {
        throw new Error("No data provided to update.");
      }

      // Construct the SQL query dynamically based on filteredUpdateData keys
      const fields = Object.keys(filteredUpdateData)
        .map((field) => `${field} = ?`)
        .join(", ");
      const values = Object.values(filteredUpdateData);
      values.push(id); // Add the ID at the end for the WHERE clause

      const sqlQuery = `
      UPDATE program
      SET ${fields}
      WHERE ProgramID = ?
    `;

      // Execute the query
      const [result] = await connection.execute(sqlQuery, values);
      return result;
    } catch (error) {
      console.error("Error updating program:", error);
      throw error;
    } finally {
      // Ensure the connection is closed even in case of an error
      if (connection) {
        await connection.end();
      }
    }
  }

  // Delete a program
  static async deleteProgram(ProgramID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            DELETE FROM Program WHERE ProgramID = ?;`;

    const [result] = await connection.execute(sqlQuery, [ProgramID]);
    connection.end();
  }

  // Get program by TierID
  static async getProgramByTierID(TierID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT p.ProgramID, p.ProgramName, p.ProgramDesc, p.TypeID 
        FROM Program p
        JOIN ProgramTier pt ON p.ProgramID = pt.ProgramID
        WHERE pt.TierID = ?;
    `;
    const [rows] = await connection.execute(sqlQuery, [TierID]);
    connection.end();

    if (rows.length === 0) {
      return null; // No program found for the given TierID
    }

    return rows.map(
      (row) =>
        new Program(row.ProgramID, row.ProgramName, row.ProgramDesc, row.TypeID)
    );
  }

  // Get program by SessionID
  static async getProgramBySessionID(SessionID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT p.ProgramID, p.ProgramName, p.ProgramDesc, p.TypeID 
        FROM Program p
        JOIN ProgramTier pt ON p.ProgramID = pt.ProgramID
        JOIN Session s ON pt.TierID = s.TierID
        WHERE s.SessionID = ?;
    `;
    const [rows] = await connection.execute(sqlQuery, [SessionID]);
    connection.end();

    if (rows.length === 0) {
      return null; // No program found for the given SessionID
    }

    return rows.map(
      (row) =>
        new Program(row.ProgramID, row.ProgramName, row.ProgramDesc, row.TypeID)
    );
  }

  // Get top programs by signups
  static async getTopPrograms() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT 
            p.ProgramName,
            COUNT(su.SignUpID) AS TotalSignups
        FROM 
            SignUp su
        JOIN 
            Session s ON su.SessionID = s.SessionID
        JOIN 
            ProgramTier pt ON s.TierID = pt.TierID
        JOIN 
            Program p ON pt.ProgramID = p.ProgramID
        GROUP BY 
            p.ProgramID, p.ProgramName
        ORDER BY 
            TotalSignups DESC
        LIMIT 3;
    `;

    const [result] = await connection.execute(sqlQuery);
    return result; // Returns the top 3 programs
  }

  // Get programs by income
  static async getProgramsByIncome() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT 
            p.ProgramName,
            SUM(
                CASE 
                    WHEN c.MemberStatus = TRUE THEN t.DiscountedCost
                    ELSE t.Cost
                END
            ) AS TotalIncome
        FROM 
            SignUp su
        JOIN 
            Session s ON su.SessionID = s.SessionID
        JOIN 
            ProgramTier pt ON s.TierID = pt.TierID
        JOIN 
            Program p ON pt.ProgramID = p.ProgramID
        JOIN 
            Tier t ON pt.TierID = t.TierID
        JOIN 
            Customer c ON su.AccountID = c.AccountID
        GROUP BY 
            p.ProgramID, p.ProgramName
        ORDER BY 
            TotalIncome DESC;
    `;

    const [result] = await connection.execute(sqlQuery);
    return result;
  }

  static async getTopProgramByType() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT 
            pt.TypeDesc AS ProgramType,
            p.ProgramName,
            COUNT(su.SignUpID) AS TotalSignups
        FROM 
            SignUp su
        JOIN 
            Session s ON su.SessionID = s.SessionID
        JOIN 
            ProgramTier ptier ON s.TierID = ptier.TierID
        JOIN 
            Program p ON ptier.ProgramID = p.ProgramID
        JOIN 
            ProgramType pt ON p.TypeID = pt.TypeID
        GROUP BY 
            pt.TypeID, pt.TypeDesc, p.ProgramName
        ORDER BY 
            pt.TypeID, TotalSignups DESC;
    `;
    const [result] = await connection.execute(sqlQuery);
    return result;
  }

  static async getAverageRatingByProgramType() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT 
            pt.TypeDesc AS ProgramType,
            ROUND(AVG(r.Star), 1) AS AverageRating
        FROM 
            Review r
        JOIN 
            Program p ON r.ProgramID = p.ProgramID
        JOIN 
            ProgramType pt ON p.TypeID = pt.TypeID
        GROUP BY 
            pt.TypeID, pt.TypeDesc;
    `;
    const [result] = await connection.execute(sqlQuery);
    return result;
  }

  static async getAverageRatingForEachProgram(programID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT 
            ROUND(AVG(Star), 1) AS AverageRating
        FROM 
            Review
        WHERE 
            ProgramID = ?;
    `;
    const [result] = await connection.execute(sqlQuery, [programID]);
    return result[0] || null;
  }

  static async getAverageRatingForAllPrograms() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT 
            p.ProgramName,
            ROUND(AVG(r.Star), 1) AS AverageRating
        FROM 
            Review r
        JOIN 
            Program p ON r.ProgramID = p.ProgramID
        GROUP BY 
            p.ProgramID, p.ProgramName
        ORDER BY 
            AverageRating DESC;
    `;
    const [result] = await connection.execute(sqlQuery);
    return result;
  }
  static async getProgramAttendees(programName, programType, programTier) {
    const connection = await mysql.createConnection(dbConfig);
    let sqlQuery = `
        SELECT 
            p.ProgramName,
            pt.TypeDesc AS ProgramType,
            t.Name AS TierName,
            COUNT(su.SignUpID) AS TotalAttendees
        FROM 
            SignUp su
        JOIN 
            Session s ON su.SessionID = s.SessionID
        JOIN 
            ProgramTier ptier ON s.TierID = ptier.TierID
        JOIN 
            Program p ON ptier.ProgramID = p.ProgramID
        JOIN 
            ProgramType pt ON p.TypeID = pt.TypeID
        JOIN 
            Tier t ON ptier.TierID = t.TierID
        WHERE 1=1
    `;
    const queryParams = [];
    if (programName) {
      sqlQuery += ` AND p.ProgramName = ?`;
      queryParams.push(programName);
    }
    if (programType) {
      sqlQuery += ` AND pt.TypeDesc = ?`;
      queryParams.push(programType);
    }
    if (programTier) {
      sqlQuery += ` AND t.Name = ?`;
      queryParams.push(programTier);
    }
    sqlQuery += `
        GROUP BY 
            p.ProgramID, p.ProgramName, pt.TypeDesc, t.Name
        ORDER BY 
            TotalAttendees DESC;
    `;
    const [result] = await connection.execute(sqlQuery, queryParams);
    connection.end();
    return result;
  }
}

module.exports = Program;
