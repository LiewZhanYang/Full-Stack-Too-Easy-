// models/Customer.js
const db = require("../dbConfig");

class Customer {
  static async addCustomer(customerData) {
    const {
      accountID,
      name,
      emailAddr,
      contactNo,
      memberStatus = false,
      membershipExpiry = null,
      dateJoined = new Date(),
      pfpPath = null,
      password,
    } = customerData;

    // Prepare SQL query and values
    const query = accountID
      ? `INSERT INTO Customer (AccountID, Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      : `INSERT INTO Customer (Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = accountID
      ? [
          accountID,
          name,
          emailAddr,
          contactNo,
          memberStatus,
          membershipExpiry,
          dateJoined,
          pfpPath,
          password,
        ]
      : [
          name,
          emailAddr,
          contactNo,
          memberStatus,
          membershipExpiry,
          dateJoined,
          pfpPath,
          password,
        ];

    // Execute the query
    const [result] = await db.execute(query, values);
    return result;
  }

  static async getCustomerById(id) {
    try {
      const query = `SELECT * FROM Customer WHERE AccountID = ?`;
      const [rows] = await db.execute(query, [id]);
      return rows; // Ensure this returns an array of results
    } catch (error) {
      console.error("Error in getCustomerById:", error);
      throw error;
    }
  }

  static async updateCustomer(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    values.push(id);

    const query = `UPDATE Customer SET ${fields
      .map((field) => `${field} = ?`)
      .join(", ")} WHERE AccountID = ?`;
    const [result] = await db.execute(query, values);
    return result;
  }

  static async deleteCustomer(id) {
    const deleteBookingsQuery = `DELETE FROM Booking WHERE AccountID = ?`;
    const deleteCustomerQuery = `DELETE FROM Customer WHERE AccountID = ?`;

    await db.execute(deleteBookingsQuery, [id]);
    const [result] = await db.execute(deleteCustomerQuery, [id]);
    return result;
  }
}

module.exports = Customer;
