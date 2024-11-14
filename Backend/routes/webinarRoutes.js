// routes/signupRoutes.js (assuming for webinars)
const express = require("express");
const router = express.Router();
const webinarController = require("../controllers/webinarController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Routes for webinars
router.get("/", webinarController.getAllWebinar);
router.get("/:id", webinarController.getAllWebinarByID);
router.put("/:id", upload.single("file"), webinarController.updateWebinar); // Updated to handle file uploads
router.post("/", upload.single("file"), webinarController.postWebinar); // Updated to handle file uploads
router.delete("/:id", webinarController.deleteWebinar);

module.exports = router;
