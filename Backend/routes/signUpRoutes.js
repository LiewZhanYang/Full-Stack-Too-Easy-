// routes/signupRoutes.js
const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signUpController");

router.get("/", signupController.getAllSignUps);
router.get("/:id", signupController.getSignUpById);
router.post("/", signupController.createSignUp);
router.put("/:id", signupController.updateSignUp);
router.delete("/:id", signupController.deleteSignUp);

module.exports = router;
