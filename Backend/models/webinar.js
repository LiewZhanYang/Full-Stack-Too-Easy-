const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Webinar {
  constructor(
    WebinarID,
    WebinarName,
    WebinarDesc,
    Link,
    Date,
    StartTime,
    EndTime,
    Speaker
  ) {
    this.WebinarID = WebinarID;
    this.WebinarName = WebinarName;
    this.WebinarDesc = WebinarDesc;
    this.Link = Link;
    this.Date = Date;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
    this.Speaker = Speaker;
  }

  static async getAllWebinarByID(webinarID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Webinar WHERE WebinarID = ?
        `;

    const [result] = await connection.execute(sqlQuery, [webinarID]);

    connection.end();
    return result.map((row) => {
      return new Webinar(
        row.WebinarID,
        row.WebinarName,
        row.WebinarDesc,
        row.Link,
        row.Date,
        row.StartTime,
        row.EndTime,
        row.Speaker
      );
    });
  }

  static async getAllWebinar() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Webinar WHERE Date >= CURDATE()
        `;
    const [result] = await connection.execute(sqlQuery);

    connection.end();
    return result.map((row) => {
      return new Webinar(
        row.WebinarID,
        row.WebinarName,
        row.WebinarDesc,
        row.Link,
        row.Date,
        row.StartTime,
        row.EndTime,
        row.Speaker
      );
    });
  }

  static async updateWebinar(id, updateData) {
    const connection = await mysql.createConnection(dbConfig);

    // Construct the SQL query dynamically based on updateData keys
    const fields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updateData);
    values.push(id); // Add the ID at the end for the WHERE clause

    const sqlQuery = `
            UPDATE Webinar
            SET ${fields}
            WHERE WebinarID = ?
        `;

    try {
      const [result] = await connection.execute(sqlQuery, values);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error updating Webinar:", error);
      connection.end();
      throw error;
    }
  }

  static async postWebinar(webinarDetails) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);

      const sqlQuery = `
            INSERT INTO Webinar (WebinarName, WebinarDesc, Link, Date, StartTime, EndTime, Speaker)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

      const values = [
        webinarDetails.WebinarName,
        webinarDetails.WebinarDesc,
        webinarDetails.Link,
        webinarDetails.Date,
        webinarDetails.StartTime,
        webinarDetails.EndTime,
        webinarDetails.Speaker,
      ];

      const [result] = await connection.execute(sqlQuery, values);
      console.log("Insert result:", result);

      if (!result.insertId) {
        throw new Error("No WebinarID generated");
      }

      return { WebinarID: result.insertId };
    } catch (error) {
      console.error("Error inserting webinar to the database:", error.message);
      throw error;
    } finally {
      if (connection) connection.end();
    }
  }

  static async deleteWebinar(webinarID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
            DELETE FROM Webinar WHERE WebinarID = ?;`;

    const [result] = await connection.execute(sqlQuery, [webinarID]);
    connection.end();
  }
}

module.exports = Webinar;
