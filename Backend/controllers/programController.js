const db = require("../dbConfig"); // Import database configuration

// Create (Add) a new program
exports.addProgram = (req, res) => {
  const { ProgramName, Cost, TypeID } = req.body;
  const query = `INSERT INTO Program (ProgramName, Cost, TypeID) VALUES (?, ?, ?)`;

  db.query(query, [ProgramName, Cost, TypeID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Program added successfully", data: result });
  });
};

// Read (Get) a specific program by ID
exports.getProgramById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Program WHERE ProgramID = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result[0]);
  });
};

// Update an existing program
exports.updateProgram = (req, res) => {
  const { id } = req.params;
  const { ProgramName, Cost, TypeID } = req.body;
  const query = `UPDATE Program SET ProgramName = ?, Cost = ?, TypeID = ? WHERE ProgramID = ?`;

  db.query(query, [ProgramName, Cost, TypeID, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(200)
      .json({ message: "Program updated successfully", data: result });
  });
};

// Delete a program
exports.deleteProgram = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Program WHERE ProgramID = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Program deleted successfully" });
  });
};
