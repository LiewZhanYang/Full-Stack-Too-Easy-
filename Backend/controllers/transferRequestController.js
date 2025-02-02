const TransferRequest = require("../models/transferRequest");
const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");
const { uploadDocument } = require("./uploadController");

// Create a new transfer request (ensures the 3-day rule)
exports.createTransferRequest = async (req, res) => {
  try {
    let { signUpID, newSessionID, reason, MCpath } = req.body;
    // Handle document upload if a file is provided
    if (req.file) {
      try {
        const id = 1;
        const uploadResult = await uploadDocument(req.file, id); // Use uploadController for file upload
        MCpath = uploadResult.data.Location || null; // Ensure mcPath is set to null if no URL is returned
      } catch (uploadError) {
        console.error("Error uploading document:", uploadError);
        return res.status(500).json({ message: "Error uploading document" });
      }
    }
    if (!signUpID || !newSessionID || !reason) {
      return res
        .status(400)
        .json({ error: "SignUpID, NewSessionID, and Reason are required." });
    }
    const connection = await mysql.createConnection(dbConfig);

    // Check if the transfer is made at least 3 days before session start
    const sessionCheckQuery = `
      SELECT s.StartDate 
      FROM SignUp su
      JOIN Session s ON su.SessionID = s.SessionID
      WHERE su.SignUpID = ?;
    `;
    const [sessionResult] = await connection.execute(sessionCheckQuery, [
      signUpID,
    ]);

    if (sessionResult.length === 0) {
      return res.status(404).json({ error: "Original session not found." });
    }

    const sessionStartDate = new Date(sessionResult[0].StartDate);
    const today = new Date();
    const threeDaysBeforeSession = new Date(sessionStartDate);
    threeDaysBeforeSession.setDate(sessionStartDate.getDate() - 3);

    if (today > threeDaysBeforeSession) {
      return res.status(400).json({
        error:
          "Transfer requests must be made at least 3 days before the session starts.",
      });
    }

    // Create the transfer request
    const transferID = await TransferRequest.createTransferRequest(
      signUpID,
      newSessionID,
      reason,
      MCpath
    );
    res
      .status(201)
      .json({ message: "Transfer request created successfully", transferID });
  } catch (error) {
    console.error("Error creating transfer request:", error);
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
