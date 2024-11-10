const Program = require("../models/program");

const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.getAllPrograms();
    if (programs.length === 0) {
      return res.status(404).send("Programs not found");
    }
    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving programs");
  }
};

const postProgram = async (req, res) => {
  const programDetails = req.body;
  try {
    const newProgram = await Program.postProgram(programDetails);
    res.status(201).json(newProgram);
    console.log("Successfully posted Program");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting program");
  }
};

const updateProgram = async (req, res) => {
  const id = parseInt(req.params.id); // Program ID from URL parameters
  const updateData = req.body; // Program data to be updated

  try {
    const result = await Program.updateProgram(id, updateData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json({ message: "Program updated successfully" });
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({ message: "Error updating program" });
  }
};

module.exports = { getAllPrograms, postProgram, updateProgram };
