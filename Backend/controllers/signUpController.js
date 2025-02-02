const SignUp = require("../models/signup"); // Should match exported class name

const getAllSignUps = async (req, res) => {
  try {
    const signups = await SignUp.getAllSignUps();
    console.log("Retrieved signups:", signups);
    res.status(200).json(signups);
  } catch (error) {
    console.error("Error retrieving signups:", error);
    res.status(500).json({ error: "Failed to retrieve signups" });
  }
};

const getSignUpById = async (req, res) => {
  const { id } = req.params;

  try {
    const signups = await SignUp.getSignUpById(id); // Ensure the model method matches the new naming
    if (!signups.length) {
      return res.status(404).json({ message: "No signups found for this account." });
    }
    res.status(200).json(signups);
  } catch (error) {
    console.error("Error fetching signups:", error);
    res.status(500).json({ error: "Failed to fetch signups." });
  }
};



const createSignUp = async (req, res) => {
  try {
    const { AccountID, SessionID, LunchOptionID, ChildID } = req.body;

    // Validate required fields
    if (!AccountID || !SessionID || !LunchOptionID || !ChildID) {
      return res.status(400).json({ error: "Missing required fields in request body." });
    }

    const signUpDetails = { AccountID, SessionID, LunchOptionID, ChildID };

    const newSignUpId = await SignUp.postSignUp(signUpDetails);

    res.status(201).json({
      success: true,
      message: "Signup created successfully",
      signUpId: newSignUpId,
    });
  } catch (error) {
    console.error("Error creating signup:", error);

    if (error.code === "ER_NO_REFERENCED_ROW") {
      res.status(400).json({
        error: "Invalid foreign key reference. Please check the provided IDs.",
      });
    } else if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Duplicate signup entry. Entry already exists." });
    } else {
      res.status(500).json({ error: "Failed to create signup" });
    }
  }
};


const updateSignUp = async (req, res) => {
  try {
    const { id } = req.params;
    const { AccountID, SessionID, LunchOptionID, ChildID } = req.body;

    const signUpDetails = { AccountID, SessionID, LunchOptionID, ChildID };

    const success = await SignUp.updateSignUp(id, signUpDetails);

    if (success) {
      res.status(200).json({ message: "Signup updated successfully" });
    } else {
      res.status(404).json({ message: "Signup not found" });
    }
  } catch (error) {
    console.error("Error updating signup:", error);
    res.status(500).json({ error: "Failed to update signup" });
  }
};

const deleteSignUp = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await SignUp.deleteSignUp(id);

    if (success) {
      res.status(200).json({ message: "Signup deleted successfully" });
    } else {
      res.status(404).json({ message: "Signup not found" });
    }
  } catch (error) {
    console.error("Error deleting signup:", error);
    res.status(500).json({ error: "Failed to delete signup" });
  }
};

module.exports = {
  getAllSignUps,
  getSignUpById,
  createSignUp,
  updateSignUp,
  deleteSignUp,
};
