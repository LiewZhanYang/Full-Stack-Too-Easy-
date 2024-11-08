const dbConfig = require('../dbConfig');
const mysql = require('mysql2/promise');

class Admin {
    constructor(AdminID, Username, Password){
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
        return result.map(row => {
            return new Admin(
            row.AdminID,
            row.Username, 
            row.Password
        )});
    }
}

module.exports = Admin