const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Child {
  constructor(
    ChildID,
    Name,
    Strength,
    DOB,
    Age,
    AccountID,
    SpecialLearningNeeds,
    DietaryRestrictions,
    Notes
  ) {
    this.ChildID = ChildID;
    this.Name = Name;
    this.Strength = Strength;
    this.DOB = DOB;
    this.Age = Age;
    this.AccountID = AccountID;
    this.SpecialLearningNeeds = SpecialLearningNeeds;
    this.DietaryRestrictions = DietaryRestrictions;
    this.Notes = Notes;
  }

  static async getChildByAccountID(AccountID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM child WHERE AccountID = ?
        `;
    const [result] = await connection.execute(sqlQuery, [AccountID]);

    connection.end();
    return result.map((row) => {
      return new Child(
        row.ChildID,
        row.Name,
        row.Strength,
        row.DOB,
        row.Age,
        row.AccountID,
        row.SpecialLearningNeeds,
        row.DietaryRestrictions,
        row.Notes
      );
    });
  }

  static async postChild(childDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const formattedDOB = new Date(childDetails.DOB).toISOString().slice(0, 10); 

    const sqlQuery = `
        INSERT INTO child (Name, Strength, DOB, Age, AccountID, DietaryRestrictions, SpecialLearningNeeds)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      childDetails.Name,
      childDetails.Strength,
      formattedDOB, 
      childDetails.Age,
      childDetails.AccountID,
      childDetails.DietaryRestrictions,
      childDetails.SpecialLearningNeeds,
    ];

    try {
      console.log("Attempting to insert child with details:", values);
      const [result] = await connection.execute(sqlQuery, values);
      console.log("Child inserted successfully with ID:", result.insertId);

      connection.end();
      return { id: result.insertId };
    } catch (error) {
      console.error("Error inserting child into database. Details:", error);
      throw error;
    } finally {
      if (connection) connection.end();
    }
  }

  static async deleteChild(id) {
    const connection = await mysql.createConnection(dbConfig);
    const deleteSignUpQuery = `
            DELETE FROM signUp WHERE childID = ?;`;
    const deleteChildQuery = `
            DELETE FROM child WHERE childID = ?;`;
    const [result] = await connection.execute(deleteSignUpQuery, [id]);
    const [result1] = await connection.execute(deleteChildQuery, [id]);
    connection.end();
  }

  static async updateChild(id, childDetails) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
            UPDATE child
            SET Name = ?, Strength = ?, DOB = ? , DietaryRestrictions = ?, SpecialLearningNeeds = ?
            WHERE childID = ?`;

    const values = [
      childDetails.Name,
      childDetails.Strength,
      childDetails.DOB,
      childDetails.DietaryRestrictions,
      childDetails.SpecialLearningNeeds,
      id,
    ];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
  }

  static async updateChildNotes(id, notes) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
        UPDATE child
        SET Notes = ?
        WHERE childID = ?`;

    const values = [notes.notes, id];

    const [result] = await connection.execute(sqlQuery, values);
    connection.end();
  }

  static async getChildBySessionID(id) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
        SELECT * FROM Child WHERE ChildID IN (
        SELECT ChildID FROM SignUp WHERE SessionID = ?)
        `;
    const [result] = await connection.execute(sqlQuery, [id]);

    connection.end();
    return result.map((row) => {
      return new Child(
        row.ChildID,
        row.Name,
        row.Strength,
        row.DOB,
        row.Age,
        row.AccountID,
        row.DietaryRestrictions,
        row.SpecialLearningNeeds,
        row.Notes
      );
    });
  }

  static async getCustomerByChildID(childID) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
            SELECT Customer.*
            FROM Customer
            JOIN Child ON Customer.AccountID = Child.AccountID
            WHERE Child.ChildID = ?
        `;

    const [result] = await connection.execute(sqlQuery, [childID]);
    connection.end();

    if (result.length === 0) {
      throw new Error("No customer found for the given ChildID.");
    }

    return result[0];
  }
}

module.exports = Child;
