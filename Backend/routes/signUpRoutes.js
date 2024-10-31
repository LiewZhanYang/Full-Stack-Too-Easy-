const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");

// Create a new sign-up
router.post("/signUp", signUpController.createSignUp);

// Get all sign-ups
router.get("/signUp", signUpController.getAllSignUps);

// Get a specific sign-up
router.get("/signUp/:id", signUpController.getSignUpById);

// Update a specific sign-up
router.put("/signUp/:id", signUpController.updateSignUp);

// Delete a specific sign-up
router.delete("/signUp/:id", signUpController.deleteSignUp);

module.exports = router;
