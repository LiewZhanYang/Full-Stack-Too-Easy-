const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Program {
  constructor(ProgramID, ProgramName, ProgramDesc, TypeID) {
    this.ProgramID = ProgramID;
    this.ProgramName = ProgramName;
    this.ProgramDesc = ProgramDesc;
    this.TypeID = TypeID;
  }

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
        row.Cost,
        row.DiscountedCost,
        row.LunchProvided,
        row.Duration,
        row.ClassSize,
        row.TypeID
      );
    });
  }

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

  static async deleteProgram(ProgramID) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            DELETE FROM Program WHERE ProgramID = ?;`;

    const [result] = await connection.execute(sqlQuery, [ProgramID]);
    connection.end();
  }


  }


module.exports = Program;
