// routes/signupRoutes.js (assuming for webinars)
const express = require("express");
const router = express.Router();
const webinarController = require("../controllers/webinarController");

// Routes for webinars
router.get("/", webinarController.getAllWebinar);
router.get("/:id", webinarController.getAllWebinarByID);
router.put("/:id", webinarController.updateWebinar); // Updated to handle file uploads
router.post("/", webinarController.postWebinar); // Updated to handle file uploads
router.delete("/:id", webinarController.deleteWebinar);

module.exports = router;
