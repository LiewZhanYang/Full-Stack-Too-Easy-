const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class ProgramType {
    constructor(TypeID, TypeDesc) {
        this.TypeID = TypeID;
        this.TypeDesc = TypeDesc;
    }

    static async getTypeByID(id) {
        const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        SELECT * FROM ProgramType WHERE TypeID = ?
    `;
    const [rows] = await connection.execute(sqlQuery, [id]);
    connection.end();

    if (rows.length === 0) {
      return null; // Return null if no program found with the given ID
    }

    const row = rows[0];
    return new ProgramType(row.TypeID, row.TypeDesc);
    }
}

module.exports = ProgramType