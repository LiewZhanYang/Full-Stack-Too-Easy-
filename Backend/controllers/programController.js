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
    // Create the new program in the database
    const newProgram = await Program.postProgram(programDetails);
    console.log("New program created:", newProgram);

    if (!newProgram.ProgramID) {
      return res.status(500).json({ error: "Failed to create new program" });
    }

    // Optional: Upload a program picture if a file is provided
    if (req.file) {
      try {
        await uploadController.uploadProgramPic(req.file, newProgram.ProgramID); // Corrected parameter handling
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
    // Update program data in the database
    const result = await Program.updateProgram(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Handle file upload if present
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
}

module.exports = {
  getAllPrograms,
  postProgram,
  updateProgram,
  getProgramById,
  getProgramBySignUp,
  deleteProgram
};
