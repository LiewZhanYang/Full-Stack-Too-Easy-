const db = require("../dbConfig"); // Assuming dbConfig.js is your database connection setup

// Get all sessions
exports.getAllSessions = (req, res) => {
  const query = `SELECT * FROM Session`;
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
};

// Get session by ID
exports.getSessionById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Session WHERE SessionID = ?`;
  db.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results[0]);
  });
};

// Create a new session
exports.createSession = (req, res) => {
  const { Date, Time, ProgramID } = req.body;
  const query = `INSERT INTO Session (Date, Time, ProgramID) VALUES (?, ?, ?)`;
  db.query(query, [Date, Time, ProgramID], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res
      .status(201)
      .json({ message: "Session created", sessionId: results.insertId });
  });
};

// Update an existing session
exports.updateSession = (req, res) => {
  const { id } = req.params;
  const { Date, Time, ProgramID } = req.body;
  const query = `UPDATE Session SET Date = ?, Time = ?, ProgramID = ? WHERE SessionID = ?`;
  db.query(query, [Date, Time, ProgramID, id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Session updated" });
  });
};

// Delete a session
exports.deleteSession = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Session WHERE SessionID = ?`;
  db.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Session deleted" });
  });
};
