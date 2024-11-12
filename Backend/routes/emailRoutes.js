// routes/emailRoute.js
const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// POST endpoint to send an email notification
router.post("/send", emailController.sendEmailNotification);

module.exports = router;
