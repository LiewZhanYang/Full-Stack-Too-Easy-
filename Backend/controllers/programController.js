const Program = require("../models/program");
const uploadController = require("../controllers/uploadController");
const { getProgramPicByProgramID } = require("../controllers/uploadController"); // Adjust path if necessary

// Retrieve all programs and attach image URLs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.getAllPrograms();
    if (programs.length === 0) {
      return res.status(404).send("Programs not found");
    }

    const programsWithImages = await Promise.all(
      programs.map(async (program) => {
        try {
          const { url } = await getProgramPicByProgramID(program.ProgramID);
          return { ...program, image: url };
        } catch (error) {
          console.error(
            `Error fetching image for ProgramID ${program.ProgramID}:`,
            error
          );
          return { ...program, image: "/img/default.jpg" }; // Fallback image
        }
      })
    );

    res.status(200).json(programsWithImages);
  } catch (error) {
    console.error("Error retrieving programs:", error);
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
  console.log("Received program details:", programDetails);

  try {
    const newProgram = await Program.postProgram(programDetails);
    console.log("New program created:", newProgram);

    if (!newProgram.ProgramID) {
      return res.status(500).json({ error: "Failed to create new program" });
    }

    if (req.file) {
      try {
        await uploadController.uploadProgramPic(req.file, newProgram.ProgramID);
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
  const id = parseInt(req.params.id, 10);
  const updateData = req.body;

  try {
    const result = await Program.updateProgram(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    if (req.file) {
      console.log("File received for upload during update:", req.file);
      try {
        await uploadController.uploadProgramPic(req.file, id);
      } catch (uploadError) {
        console.error(
          "Error uploading program picture during update:",
          uploadError
        );
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

// Retrieve programs by sign-up
const getProgramBySignUp = async (req, res) => {
  const { id: AccountID } = req.params;
  try {
    const programs = await Program.getProgramBySignUp(AccountID);
    if (!programs || programs.length === 0) {
      return res.status(404).send("Programs not found");
    }
    res.json(programs);
  } catch (error) {
    console.error("Error retrieving programs by sign-up:", error);
    res.status(500).send("Error retrieving programs");
  }
};

// Delete a program
const deleteProgram = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedProgram = await Program.deleteProgram(id);
    res.status(201).json(deletedProgram);
    console.log("Successfully deleted Program");
  } catch (error) {
    console.error(error);
    res.status(403).send("Cannot delete Programs, there are sessions");
  }
};

// Retrieve programs by type
const getProgramsByProgramType = async (req, res) => {
  const { typeID } = req.params;
  try {
    const programs = await Program.getProgramsByType(typeID);
    if (!programs || programs.length === 0) {
      return res
        .status(404)
        .json({ message: "No programs found for this type" });
    }
    res.json(programs);
  } catch (error) {
    console.error("Error retrieving programs by type:", error);
    res.status(500).json({ message: "Error retrieving programs by type" });
  }
};

// Retrieve programs by TierID
const getProgramByTierID = async (req, res) => {
  const { tierID } = req.params;
  try {
    const programs = await Program.getProgramByTierID(tierID);
    if (!programs || programs.length === 0) {
      return res
        .status(404)
        .json({ message: "No programs found for this TierID" });
    }
    res.json(programs);
  } catch (error) {
    console.error("Error retrieving programs by TierID:", error);
    res.status(500).json({ message: "Error retrieving programs by TierID" });
  }
};

// Retrieve programs by SessionID
const getProgramBySessionID = async (req, res) => {
  const { sessionID } = req.params;
  try {
    const programs = await Program.getProgramBySessionID(sessionID);
    if (!programs || programs.length === 0) {
      return res
        .status(404)
        .json({ message: "No programs found for this SessionID" });
    }
    res.json(programs);
  } catch (error) {
    console.error("Error retrieving programs by SessionID:", error);
    res.status(500).json({ message: "Error retrieving programs by SessionID" });
  }
};

// Retrieve program by Tier
const getProgramByTier = async (req, res) => {
  try {
    const { tierID } = req.params;
    console.log("Fetching ProgramID for TierID:", tierID);

    const programIDs = await Program.getProgramByTier(tierID);

    if (!programIDs) {
      return res
        .status(404)
        .json({ message: "No program found for this TierID." });
    }

    res.json({ ProgramIDs: programIDs });
  } catch (error) {
    console.error("Error fetching Program by Tier:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getAllPrograms,
  postProgram,
  updateProgram,
  getProgramById,
  getProgramBySignUp,
  deleteProgram,
  getProgramsByProgramType,
  getProgramByTierID,
  getProgramBySessionID,
  getProgramByTier,
};
