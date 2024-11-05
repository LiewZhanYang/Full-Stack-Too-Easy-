// models/Customer.js
const db = require("../dbConfig");

class Customer {
  static async addCustomer(customerData) {
    try {
      const {
        Name,
        EmailAddr,
        ContactNo,
        Password,
        MemberStatus = null, // Set default to null
        MembershipExpiry = null, // Set default to null
        DateJoined = new Date(), // Set to current date by default
        PfpPath = null, // Set default to null
      } = customerData;

      // Log the variables to ensure they are set correctly
      console.log("Customer data prepared for SQL:", {
        Name,
        EmailAddr,
        ContactNo,
        MemberStatus,
        MembershipExpiry,
        DateJoined,
        PfpPath,
        Password,
      });

      // Prepare SQL query
      const query = `
            INSERT INTO Customer (Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      // Prepare values
      const values = [
        Name,
        EmailAddr,
        ContactNo,
        MemberStatus, // Will be null if not provided
        MembershipExpiry, // Will be null if not provided
        DateJoined, // Current date
        PfpPath, // Will be null if not provided
        Password,
      ];

      // Check for undefined values and log them
      values.forEach((value, index) => {
        if (value === undefined) {
          console.error(
            `Value at index ${index} is undefined. Setting to null.`
          );
          values[index] = null; // Set undefined values to null
        }
      });

      // Execute the query
      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error in addCustomer:", error);
      throw error; // Rethrow error for further handling in the controller
    }
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
