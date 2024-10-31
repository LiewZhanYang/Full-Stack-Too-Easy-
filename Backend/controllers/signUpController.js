const db = require("../dbConfig"); // Assuming dbConfig is set up for MySQL connection

// Create a new sign-up
exports.createSignUp = (req, res) => {
  const { AccountID, SessionID, LunchOptionID, ChildID } = req.body;
  const query = `INSERT INTO SignUp (AccountID, SessionID, LunchOptionID, ChildID) VALUES (?, ?, ?, ?)`;

  db.query(
    query,
    [AccountID, SessionID, LunchOptionID, ChildID],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "SignUp created successfully", id: result.insertId });
    }
  );
};

// Get all sign-ups
exports.getAllSignUps = (req, res) => {
  const query = `SELECT * FROM SignUp`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Get a specific sign-up by ID
exports.getSignUpById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM SignUp WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "SignUp not found" });
    res.status(200).json(result[0]);
  });
};

// Update a specific sign-up by ID
exports.updateSignUp = (req, res) => {
  const { id } = req.params;
  const { AccountID, SessionID, LunchOptionID, ChildID } = req.body;
  const query = `UPDATE SignUp SET AccountID = ?, SessionID = ?, LunchOptionID = ?, ChildID = ? WHERE id = ?`;

  db.query(query, [AccountID, SessionID, LunchOptionID, ChildID, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "SignUp updated successfully" });
  });
};

// Delete a specific sign-up by ID
exports.deleteSignUp = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM SignUp WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "SignUp deleted successfully" });
  });
};
