const db = require("../dbConfig"); // Import database configuration

// Create (Add) a new customer
exports.addCustomer = (req, res) => {
  const {
    AccountID,
    Name,
    EmailAddr,
    ContactNo,
    MemberStatus = false, // default to false if not provided
    MembershipExpiry,
    DateJoined,
    PfpPath,
    Password,
  } = req.body;

  // Basic validation
  if (!Name || !EmailAddr || !ContactNo || !Password) {
    return res
      .status(400)
      .json({
        error: "Name, EmailAddr, ContactNo, and Password are required fields.",
      });
  }

  // Ensure ContactNo is an 8-digit numeric string
  if (!/^\d{8}$/.test(ContactNo)) {
    return res
      .status(400)
      .json({ error: "ContactNo must be an 8-digit numeric string." });
  }

  // Ensure EmailAddr is unique - You can optionally check this with a separate query
  const query = AccountID
    ? `INSERT INTO Customer (AccountID, Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    : `INSERT INTO Customer (Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = AccountID
    ? [
        AccountID,
        Name,
        EmailAddr,
        ContactNo,
        MemberStatus,
        MembershipExpiry,
        DateJoined,
        PfpPath,
        Password,
      ]
    : [
        Name,
        EmailAddr,
        ContactNo,
        MemberStatus,
        MembershipExpiry,
        DateJoined,
        PfpPath,
        Password,
      ];

  db.query(query, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ error: "EmailAddr or ContactNo already exists." });
      }
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

  const query = `UPDATE Customer SET ${querySegments.join(
    ", "
  )} WHERE AccountID = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(200)
      .json({ message: "Customer updated successfully", data: result });
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

      res
        .status(200)
        .json({
          message: "Customer and related bookings deleted successfully",
        });
    });
  });
};
