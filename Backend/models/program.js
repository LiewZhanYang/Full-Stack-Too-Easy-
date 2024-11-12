const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Program {
  constructor(ProgramID, ProgrameName, ProgramDesc, Cost, DiscountedCost, LunchProvided, Duration, ClassSize, TypeID) {
    this.ProgramID = ProgramID;
    this.ProgrameName = ProgrameName;
    this.ProgramDesc = ProgramDesc;
    this.LunchProvided = LunchProvided;
    this.Duration = Duration;
    this.ClassSize = ClassSize;
    this.Cost = Cost;
    this.DiscountedCost = DiscountedCost;
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
    return new Program(row.ProgramID, row.ProgramName, row.ProgramDesc, row.Cost, row.DiscountedCost, row.LunchProvided, row.Duration, row.ClassSize, row.TypeID);
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
      return new Program(row.ProgramID, row.ProgramName, row.ProgramDesc, row.Cost, row.DiscountedCost, row.LunchProvided, row.Duration, row.ClassSize, row.TypeID);
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
      return new Program(row.ProgramID, row.ProgramName, row.ProgramDesc, row.Cost, row.DiscountedCost, row.LunchProvided, row.Duration, row.ClassSize, row.TypeID);
    });
  }

  static async postProgram(programDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            INSERT INTO program (ProgramName, ProgramDesc, Cost, LunchProvided, Duration, ClassSize, TypeID)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      programDetails.ProgramName,
      programDetails.ProgramDesc,
      programDetails.Cost,
      programDetails.LunchProvided,
      programDetails.Duration,
      programDetails.ClassSize, 
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
            UPDATE program
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
