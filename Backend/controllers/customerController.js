const db = require("../dbConfig"); // Import database configuration

// Create (Add) a new customer
exports.addCustomer = (req, res) => {
  const {
    AccountID,
    Name,
    EmailAddr,
    ContactNo,
    MemberStatus,
    MembershipExpiry,
    DateJoined,
    PfpPath,
    Password,
  } = req.body;

  let query, values;

  if (AccountID) {
    // If AccountID is provided, include it in the query
    query = `INSERT INTO Customer (AccountID, Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [
      AccountID,
      Name,
      EmailAddr,
      ContactNo,
      MemberStatus,
      MembershipExpiry,
      DateJoined,
      PfpPath,
      Password,
    ];
  } else {
    // If AccountID is not provided, let the database auto-increment it
    query = `INSERT INTO Customer (Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [
      Name,
      EmailAddr,
      ContactNo,
      MemberStatus,
      MembershipExpiry,
      DateJoined,
      PfpPath,
      Password,
    ];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Customer added successfully", data: result });
  });
};

// Read (Get) a specific customer by ID
exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Customer WHERE AccountID = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result[0]);
  });
};

// Update an existing customer
exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  

  const querySegments = [];
  const values = [];


  for (const field in fields) {
    querySegments.push(`${field} = ?`);
    values.push(fields[field]);
  }

  values.push(id);

  const query = `UPDATE Customer SET ${querySegments.join(', ')} WHERE AccountID = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Customer updated successfully", data: result });
  });
};


// Delete a customer
exports.deleteCustomer = (req, res) => {
  const { id } = req.params;

  const deleteBookingsQuery = `DELETE FROM Booking WHERE AccountID = ?`;

  db.query(deleteBookingsQuery, [id], (err, bookingResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const deleteCustomerQuery = `DELETE FROM Customer WHERE AccountID = ?`;

    db.query(deleteCustomerQuery, [id], (err, customerResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: "Customer and related bookings deleted successfully" });
    });
  });
};

