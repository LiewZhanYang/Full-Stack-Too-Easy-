const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Customer {
  constructor(
    AccountID,
    Name,
    EmailAddr,
    ContactNo,
    Password,
    MemberStatus,
    MembershipExpiry,
    DateJoined,
    PfpPath
  ) {
    this.AccountID = AccountID;
    this.Name = Name;
    this.EmailAddr = EmailAddr;
    this.ContactNo = ContactNo;
    this.Password = Password;
    this.MemberStatus = MemberStatus;
    this.MembershipExpiry = MembershipExpiry;
    this.DateJoined = DateJoined;
    this.PfpPath = PfpPath;
  }

  static async getCustomerByEmail(email) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT * FROM Customer WHERE EmailAddr = ?
    `;
    const [result] = await connection.execute(sqlQuery, [email]);

    connection.end();
    return result.map((row) => {
      return new Customer(
        row.AccountID,
        row.Name,
        row.EmailAddr,
        row.ContactNo,
        row.Password,
        row.MemberStatus,
        row.MembershipExpiry,
        row.DateJoined,
        row.PfpPath
      );
    });
  }

  static async getCustomerByID(id) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT * FROM Customer WHERE AccountID = ?
    `;

    const [result] = await connection.execute(sqlQuery, [id]);

    connection.end();
    return result.map((row) => {
      return new Customer(
        row.AccountID,
        row.Name,
        row.EmailAddr,
        row.ContactNo,
        row.Password,
        row.MemberStatus,
        row.MembershipExpiry,
        row.DateJoined,
        row.PfpPath
      );
    });
  }

  static async postCustomer(postCustomer) {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
      INSERT INTO Customer (Name, EmailAddr, ContactNo, MemberStatus, DateJoined, Password)
      VALUES (?, ?, ?, 0, NOW(), ?)
    `;

    const values = [
      postCustomer.Name,
      postCustomer.EmailAddr,
      postCustomer.ContactNo,
      postCustomer.Password,
    ];

    try {
      const [result] = await connection.execute(sqlQuery, values);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error creating customer:", error);
      connection.end();
      throw error;
    }
  }

  static async findCustomerByEmailOrUsername(emailOrUsername) {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT * FROM Customer 
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
      return new Customer(
        row.AccountID,
        row.Name,
        row.EmailAddr,
        row.ContactNo,
        row.Password,
        row.MemberStatus,
        row.MembershipExpiry,
        row.DateJoined,
        row.PfpPath
      );
    }
    return null;
  }

  static async updateCustomer(id, updateData) {
    const connection = await mysql.createConnection(dbConfig);

    // Construct the SQL query dynamically based on updateData keys
    const fields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updateData).map((value) =>
      value !== undefined ? value : null
    ); // Convert undefined to null
    values.push(id); // Add the ID at the end for the WHERE clause

    const sqlQuery = `
    UPDATE Customer
    SET ${fields}
    WHERE AccountID = ?
  `;

    try {
      const [result] = await connection.execute(sqlQuery, values);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error updating customer:", error);
      connection.end();
      throw error;
    }
  }
  static async getTopPayingCustomers(limit = 5) {
    const connection = await mysql.createConnection(dbConfig);
    console.log(limit);

    // Inline the limit value directly into the query
    const sqlQuery = `
    SELECT 
        p.PaidBy AS AccountID,
        c.Name AS CustomerName,
        SUM(p.Amount) AS TotalSpending,
        MAX(s.EndDate) AS LastSessionDate,
        t.Name AS LastSessionTier
    FROM 
        Payment p
    JOIN 
        Session s ON p.SessionID = s.SessionID
    JOIN 
        Tier t ON s.TierID = t.TierID
    JOIN 
        Customer c ON p.PaidBy = c.AccountID
    WHERE 
        p.Status = 'Approved'
    GROUP BY 
        p.PaidBy, c.Name, t.Name
    ORDER BY 
        TotalSpending DESC
    LIMIT ${limit};
  `;

    const [result] = await connection.execute(sqlQuery);
    connection.end();
    return result; // Return the result as an array
  }

  static async getAllCustomers() {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const sqlQuery = `SELECT * FROM Customer`;
      const [results] = await connection.execute(sqlQuery);
      connection.end();

      return results.map(
        (row) =>
          new Customer(
            row.AccountID,
            row.Name,
            row.EmailAddr,
            row.ContactNo,
            row.Password,
            row.MemberStatus,
            row.MembershipExpiry,
            row.DateJoined,
            row.PfpPath
          )
      );
    } catch (error) {
      console.error("Error retrieving customers:", error);
      connection.end();
      throw error;
    }
  }

  static async updateCustomerMembership(id) {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      UPDATE Customer
      SET MembershipExpiry = DATE_ADD(CURDATE(), INTERVAL 1 YEAR), MemberStatus = TRUE
      WHERE AccountID = ?
    `;

    try {
      const [result] = await connection.execute(sqlQuery, [id]);
      connection.end();
      return result;
    } catch (error) {
      console.error("Error updating customer:", error);
      connection.end();
      throw error;
    }
  }

  static async getNewSignUpsToday() {
    const connection = await mysql.createConnection(dbConfig);
    const sqlQuery = `
      SELECT COUNT(*) AS newSignUps
      FROM Customer
      WHERE DATE(DateJoined) = CURDATE();
    `;
    const [result] = await connection.execute(sqlQuery);
    connection.end();
    return result[0].newSignUps;
  }

  static async getHighestPayingCustomers() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT 
          c.Name AS CustomerName,
          SUM(p.Amount) AS TotalSpent,
          COUNT(DISTINCT pt.ProgramID) AS ProgramsBooked
      FROM 
          Payment p
      JOIN 
          Session s ON p.SessionID = s.SessionID
      JOIN 
          ProgramTier pt ON s.TierID = pt.TierID
      JOIN 
          Customer c ON p.PaidBy = c.AccountID
      WHERE 
          p.Status = 'Approved'
      GROUP BY 
          c.AccountID, c.Name
      ORDER BY 
          TotalSpent DESC
      LIMIT 5;
    `;

    const [result] = await connection.execute(sqlQuery);
    connection.end();

    return result;
  }

  static async getCustomerDataTable() {
    const connection = await mysql.createConnection(dbConfig);

    const sqlQuery = `
      SELECT 
          c.AccountID,
          c.Name AS CustomerName,
          COALESCE(SUM(p.Amount), 0) AS PurchaseTotal,
          COALESCE((SELECT COUNT(*) FROM Thread t WHERE t.PostedBy = c.AccountID), 0) AS ForumEngagement,
          COALESCE(GROUP_CONCAT(DISTINCT ch.Notes ORDER BY ch.ChildID SEPARATOR ', '), 'No notes') AS Notes
      FROM 
          Customer c
      LEFT JOIN 
          Payment p ON c.AccountID = p.PaidBy AND p.Status = 'Approved'
      LEFT JOIN 
          Child ch ON c.AccountID = ch.AccountID
      GROUP BY 
          c.AccountID, c.Name
      ORDER BY 
          PurchaseTotal DESC;
    `;

    const [result] = await connection.execute(sqlQuery);
    connection.end();

    return result;
  }
}

module.exports = Customer;

// class Customer {
//   static async addCustomer(customerData) {
//     try {
//       const {
// Name,
// EmailAddr,
// ContactNo,
// Password,
// MemberStatus = null, // Set default to null
// MembershipExpiry = null, // Set default to null
// DateJoined = new Date(), // Set to current date by default
// PfpPath = null, // Set default to null
//       } = customerData;

//       // Log the variables to ensure they are set correctly
//       console.log("Customer data prepared for SQL:", {
//         Name,
//         EmailAddr,
//         ContactNo,
//         MemberStatus,
//         MembershipExpiry,
//         DateJoined,
//         PfpPath,
//         Password,
//       });

//       // Prepare SQL query
//       const query = `
// INSERT INTO Customer (Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
// VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

//       // Prepare values
//       const values = [
//         Name,
//         EmailAddr,
//         ContactNo,
//         MemberStatus, // Will be null if not provided
//         MembershipExpiry, // Will be null if not provided
//         DateJoined, // Current date
//         PfpPath, // Will be null if not provided
//         Password,
//       ];

//       // Check for undefined values and log them
//       values.forEach((value, index) => {
//         if (value === undefined) {
//           console.error(
//             `Value at index ${index} is undefined. Setting to null.`
//           );
//           values[index] = null; // Set undefined values to null
//         }
//       });

//       // Execute the query
//       const [result] = await db.execute(query, values);
//       return result;
//     } catch (error) {
//       console.error("Error in addCustomer:", error);
//       throw error; // Rethrow error for further handling in the controller
//     }
//   }

//   static async getCustomerById(id) {
//     try {
//       const query = `SELECT * FROM Customer WHERE AccountID = ?`;
//       const [rows] = await db.execute(query, [id]);
//       return rows; // Ensure this returns an array of results
//     } catch (error) {
//       console.error("Error in getCustomerById:", error);
//       throw error;
//     }
//   }

//   static async updateCustomer(id, updateData) {
//     const fields = Object.keys(updateData);
//     const values = Object.values(updateData);
//     values.push(id);

//     const query = `UPDATE Customer SET ${fields
//       .map((field) => `${field} = ?`)
//       .join(", ")} WHERE AccountID = ?`;
//     const [result] = await db.execute(query, values);
//     return result;
//   }

//   static async deleteCustomer(id) {
//     const deleteBookingsQuery = `DELETE FROM Booking WHERE AccountID = ?`;
//     const deleteCustomerQuery = `DELETE FROM Customer WHERE AccountID = ?`;

//     await db.execute(deleteBookingsQuery, [id]);
//     const [result] = await db.execute(deleteCustomerQuery, [id]);
//     return result;
//   }
// }
