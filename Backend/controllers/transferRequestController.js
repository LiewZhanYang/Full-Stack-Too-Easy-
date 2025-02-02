const TransferRequest = require("../models/transferRequest");
const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");
const {
  uploadFileToS3,
  getSignedUrlFromS3,
  listObjectsByPrefix,
} = require("../models/upload");
// Create a new transfer request (ensures the 3-day rule)
exports.createTransferRequest = async (req, res) => {
  try {
    const { signUpID, newSessionID, reason } = req.body;
    let mcPath = null;

    if (!signUpID || !newSessionID || !reason) {
      return res
        .status(400)
        .json({ error: "SignUpID, NewSessionID, and Reason are required." });
    }

    // Step 1: Create Transfer Request FIRST (without MCPath)
    const transferID = await TransferRequest.createTransferRequest(
      signUpID,
      newSessionID,
      reason,
      mcPath
    );

    // Step 2: Upload File & Get Signed URL (if file is uploaded)
    if (req.file) {
      try {
        console.log(
          `📂 Uploading file: ${req.file.originalname} for TransferID: ${transferID}`
        );

        // Upload file using the existing function from upload model
        await uploadFileToS3(req.file, `Transfer-Request/${transferID}`);

        // ✅ Get the latest uploaded file in the folder using the function from upload model
        const files = await listObjectsByPrefix(
          `Transfer-Request/${transferID}`
        );

        if (files.length > 0) {
          const latestFile = files[files.length - 1].split("/").pop(); // Get the last uploaded file

          // ✅ Generate signed URL using the function from upload model
          mcPath = await getSignedUrlFromS3(
            `Transfer-Request/${transferID}`,
            latestFile
          );
          console.log("✅ Generated Signed URL:", mcPath);

          // Step 3: Update MCPath in database
          await TransferRequest.updateMCPath(transferID, mcPath);
        } else {
          console.warn(`⚠️ No file found in Transfer-Request/${transferID}`);
        }
      } catch (error) {
        console.error("❌ Error uploading document:", error);
        return res.status(500).json({ message: "Error uploading document" });
      }
    }

    res.status(201).json({
      message: "Transfer request created successfully",
      transferID,
      mcPath,
    });
  } catch (error) {
    console.error("❌ Error creating transfer request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all transfer requests
exports.getAllTransferRequests = async (req, res) => {
  try {
    const transferRequests = await TransferRequest.getAllTransferRequests();
    res.status(200).json(transferRequests);
  } catch (error) {
    console.error("Error fetching transfer requests:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get a specific transfer request by ID
exports.getTransferRequestById = async (req, res) => {
  try {
    const { transferID } = req.params;
    const transferRequest = await TransferRequest.getTransferRequestById(
      transferID
    );

    if (!transferRequest) {
      return res.status(404).json({ message: "Transfer request not found." });
    }

    res.status(200).json(transferRequest);
  } catch (error) {
    console.error("Error fetching transfer request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete a transfer request
exports.deleteTransferRequest = async (req, res) => {
  try {
    const { transferID } = req.params;
    const success = await TransferRequest.deleteTransferRequest(transferID);

    if (!success) {
      return res.status(404).json({ message: "Transfer request not found." });
    }

    res.status(200).json({ message: "Transfer request deleted successfully." });
  } catch (error) {
    console.error("Error deleting transfer request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
