const express = require("express");
const router = express.Router();
const transferRequestController = require("../controllers/transferRequestController");
const multer = require("multer");

// Configure Multer for handling profile picture uploads
const upload = multer({ storage: multer.memoryStorage() });
// Create a new transfer request
router.post(
  "/",
  upload.single("file"),
  transferRequestController.createTransferRequest
);

// Get all transfer requests
router.get("/", transferRequestController.getAllTransferRequests);

// Get a specific transfer request by ID
router.get("/:transferID", transferRequestController.getTransferRequestById);

// Delete a transfer request
router.delete("/:transferID", transferRequestController.deleteTransferRequest);

module.exports = router;
