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
  const query = `INSERT INTO Customer (AccountID, Name, EmailAddr, ContactNo, MemberStatus, MembershipExpiry, DateJoined, PfpPath, Password)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      AccountID,
      Name,
      EmailAddr,
      ContactNo,
      MemberStatus,
      MembershipExpiry,
      DateJoined,
      PfpPath,
      Password,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ message: "Customer added successfully", data: result });
    }
  );
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
  const {
    Name,
    EmailAddr,
    ContactNo,
    MemberStatus,
    MembershipExpiry,
    PfpPath,
    Password,
  } = req.body;
  const query = `UPDATE Customer SET Name = ?, EmailAddr = ?, ContactNo = ?, MemberStatus = ?, MembershipExpiry = ?, PfpPath = ?, Password = ? WHERE AccountID = ?`;

  db.query(
    query,
    [
      Name,
      EmailAddr,
      ContactNo,
      MemberStatus,
      MembershipExpiry,
      PfpPath,
      Password,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(200)
        .json({ message: "Customer updated successfully", data: result });
    }
  );
};

// Delete a customer
exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Customer WHERE AccountID = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  });
};
