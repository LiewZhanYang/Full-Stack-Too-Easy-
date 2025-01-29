const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Tier {
  constructor(
    TierID,
    Name,
    ClassSize,
    Cost,
    DiscountedCost,
    LunchProvided,
    Duration
  ) {
    (this.TierID = TierID),
      (this.Name = Name),
      (this.ClassSize = ClassSize),
      (this.Cost = Cost),
      (this.DiscountedCost = DiscountedCost),
      (this.LunchProvided = LunchProvided),
      (this.Duration = Duration);
  }
  static async getTierByProgramID(id) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            SELECT t.*
            FROM Program p
            JOIN ProgramTier pt ON p.ProgramID = pt.ProgramID
            JOIN Tier t ON pt.TierID = t.TierID
            WHERE p.ProgramID = ?;
        `;
    const [result] = await connection.execute(sqlQuery, [id]);

    connection.end();

    return result.map((row) => {
      return new Tier(
        row.TierID,
        row.Name,
        row.ClassSize,
        row.Cost,
        row.DiscountedCost,
        row.LunchProvided,
        row.Duration
      );
    });
  }
  static async getTierByTierID(id) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT * FROM
        Tier WHERE
        TierID = ?
        `;
    const [result] = await connection.execute(sqlQuery, [id]);

    connection.end();

    return result.map((row) => {
      return new Tier(
        row.TierID,
        row.Name,
        row.ClassSize,
        row.Cost,
        row.DiscountedCost,
        row.LunchProvided,
        row.Duration
      );
    });
  }
  static async deleteTier(id) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            CALL DeleteTier(?);`;

    const [result] = await connection.execute(sqlQuery, [id]);
    connection.end();
  }
  static async postTier(programID, tierDetails) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      const sqlQuery = `
        CALL CreateTier(?, ?, ?, ?, ?, ?, ?);
      `;
      const values = [
        programID, // Associate the tier with the correct program
        tierDetails.Name || null,
        tierDetails.ClassSize || null,
        tierDetails.Cost || null,
        tierDetails.DiscountedCost || null,
        tierDetails.LunchProvided ? 1 : 0,
        tierDetails.Duration || null,
      ];

      const [result] = await connection.execute(sqlQuery, values);
      return result;
    } catch (error) {
      console.error("Error creating new tier:", error);
      throw error;
    } finally {
      if (connection) connection.end();
    }
  }

  static async updateTier(id, updateData) {
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
            UPDATE Tier
            SET ${fields}
            WHERE TierID = ?
            `;

      // Execute the query
      const [result] = await connection.execute(sqlQuery, values);
      return result;
    } catch (error) {
      console.error("Error updating tier:", error);
      throw error;
    } finally {
      // Ensure the connection is closed even in case of an error
      if (connection) {
        await connection.end();
      }
    }
  }
}

module.exports = Tier;
