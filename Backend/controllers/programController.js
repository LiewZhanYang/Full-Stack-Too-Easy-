const Program = require("../models/program");
const uploadController = require("../controllers/uploadController"); // Import the uploadController

// Retrieve all programs
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

// Retrieve a program by ID
const getProgramById = async (req, res) => {
  const { id } = req.params;
  try {
    const program = await Program.getProgramById(id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    res.status(500).json({ message: "Error retrieving program" });
  }
};

// Post a new program
const postProgram = async (req, res) => {
  const programDetails = req.body;
  console.log(programDetails);
  try {
    // Create the new program in the database
    const newProgram = await Program.postProgram(programDetails);
    if (!newProgram.ProgramID) {
      return res.status(500).json({ error: "Failed to create new program" });
    }

    // Optional: Upload a program picture if a file is provided
    if (req.file) {
      try {
        await uploadController.uploadProgramPic(req, res, {
          ProgramID: newProgram.ProgramID, // Use the generated ProgramID for folder structure
        });
      } catch (uploadError) {
        console.error("Error uploading program picture:", uploadError);
        return res
          .status(500)
          .json({ error: "Program created, but error uploading picture." });
      }
    }

    res.status(201).json(newProgram);
  } catch (error) {
    console.error("Error posting program:", error);
    res.status(500).send("Error posting program");
  }
};

// Update an existing program
const updateProgram = async (req, res) => {
  const id = parseInt(req.params.id); // Program ID from URL parameters
  const updateData = req.body; // Program data to be updated

  try {
    // Update the program in the database
    const result = await Program.updateProgram(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Optional: Handle file upload if a file is provided
    if (req.file) {
      try {
        await uploadController.uploadProgramPic(req, res, {
          ProgramID: id, // Use the existing ProgramID for folder structure
        });
      } catch (uploadError) {
        console.error("Error uploading program picture:", uploadError);
        return res
          .status(500)
          .json({ error: "Program updated, but error uploading picture." });
      }
    }

    res.json({ message: "Program updated successfully" });
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({ message: "Error updating program" });
  }
};
const getProgramBySignUp = async (req, res) => {
  const AccountID = req.params.id;
  try {
    const programs = await Program.getProgramBySignUp(AccountID);
    if (!programs || programs.length === 0) {
      return res.status(404).send("Programs not found");
    }
    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving programs");
  }
};

module.exports = {
  getAllPrograms,
  postProgram,
  updateProgram,
  getProgramById,
  getProgramBySignUp,
};
