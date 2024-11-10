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
  try {
    const { id } = req.params;
    const signup = await SignUp.getSignUpById(id);

    if (signup) {
      res.status(200).json(signup);
    } else {
      res.status(404).json({ message: "Signup not found" });
    }
  } catch (error) {
    console.error("Error retrieving signup:", error);
    res.status(500).json({ error: "Failed to retrieve signup" });
  }
};

const createSignUp = async (req, res) => {
  try {
    const { AccountID, SessionID, LunchOptionID, ChildID } = req.body;
    const signUpDetails = { AccountID, SessionID, LunchOptionID, ChildID };

    const newSignUpId = await SignUp.postSignUp(signUpDetails);

    res
      .status(201)
      .json({ message: "Signup created successfully", signUpId: newSignUpId });
  } catch (error) {
    console.error("Error creating signup:", error);
    res.status(500).json({ error: "Failed to create signup" });
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
