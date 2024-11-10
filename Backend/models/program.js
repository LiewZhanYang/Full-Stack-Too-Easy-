const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Program {
  constructor(ProgramID, ProgrameName, Cost, TypeID) {
    this.ProgramID = ProgramID;
    this.ProgrameName = ProgrameName;
    this.Cost = Cost;
    this.TypeID = TypeID;
  }

  static async getAllPrograms() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Program
        `;
    const [result] = await connection.execute(sqlQuery);

    connection.end();
    return result.map((row) => {
      return new Program(row.ProgramID, row.ProgramName, row.Cost, row.TypeID);
    });
  }

  static async postProgram(programDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            INSERT INTO Program (ProgramName, Cost, TypeID)
            VALUES (?, ?, ?)`;

    const values = [
      programDetails.ProgramName,
      programDetails.Cost,
      programDetails.TypeID,
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
  }

  static async updateProgram(id, updateData) {
    const connection = await mysql.createConnection(dbConfig);

    // Construct the SQL query dynamically based on updateData keys
    const fields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updateData);
    values.push(id); // Add the ID at the end for the WHERE clause

    const sqlQuery = `
            UPDATE Program
            SET ${fields}
            WHERE ProgramID = ?
        `;

    try {
      const [result] = await connection.execute(sqlQuery, values);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error updating program:", error);
      connection.end();
      throw error;
    }
  }
}

module.exports = Program;
