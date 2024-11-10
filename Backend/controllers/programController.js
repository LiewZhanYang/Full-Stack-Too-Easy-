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

module.exports = { getAllPrograms, postProgram };
