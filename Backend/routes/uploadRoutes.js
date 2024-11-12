// uploadRoutes.js
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

// Endpoint for file upload
router.post(
  "/file",
  uploadController.uploadSingleFile,
  uploadController.uploadFile
);

module.exports = router;
