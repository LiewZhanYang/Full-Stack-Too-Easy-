// uploadRoutes.js
const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

// Configure multer for file parsing
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint for uploading a single file
router.post(
  "/file",
  upload.single("file"), // Middleware for handling single file uploads (field name: 'file')
  uploadController.uploadFile
);
router.post(
  "/profile-pic",
  upload.single("file"), // Middleware to handle single file upload (file field name is 'file')
  uploadController.uploadProfilePic
);
router.post(
  "/program-pic",
  upload.single("file"), // Middleware for handling single file upload (field name: 'file')
  uploadController.uploadProgramPic
);
module.exports = router;
