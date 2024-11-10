const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Admin {
  constructor(AdminID, Username, Password) {
    this.AdminID = AdminID;
    this.Username = Username;
    this.Password = Password;
  }

  static async getAdminByUsername(username) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Admin WHERE Username = ?
        `;
    const [result] = await connection.execute(sqlQuery, [username]);

    connection.end();
    return result.map((row) => {
      return new Admin(row.AdminID, row.Username, row.Password);
    });
  }
  static async findAdminByEmailOrUsername(emailOrUsername) {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT * FROM Admin 
      WHERE LOWER(EmailAddr) = LOWER(?) OR LOWER(Name) = LOWER(?)
      LIMIT 1
    `;

    const [result] = await connection.execute(query, [
      emailOrUsername,
      emailOrUsername,
    ]);
    connection.end();

    if (result.length > 0) {
      const row = result[0];
      return new Admin(row.AdminID, row.Name, row.EmailAddr, row.Password);
    }
    return null;
  }
}

module.exports = Admin;
