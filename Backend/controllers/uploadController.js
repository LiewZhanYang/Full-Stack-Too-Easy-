const { sendEmailNotification } = require("../controllers/emailController");
const {
  uploadFileToS3,
  getSignedUrlFromS3,
  listObjectsByPrefix,
} = require("../models/upload");

// Handle general file upload to S3 (e.g., payment invoice)
exports.uploadFile = async (file, OrderID) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  if (!OrderID) {
    throw new Error("OrderID is required for file upload.");
  }

  try {
    const data = await uploadFileToS3(file, `PaymentInvoice/${OrderID}`);
    console.log("File uploaded successfully:", data);

    // Optional: Notify via email if needed (ensure this is intended)

    const emailResponse = await sendEmailNotification(
      process.env.ADMIN_EMAIL,
      file.originalname
    );
    return {
      message: "File uploaded to S3 and email notification sent!",
      data,
      emailResponse,
    };
  } catch (error) {
    console.error("Error during file upload or email notification:", error);
    throw new Error("Error processing file upload.");
  }
};

// Handle profile picture upload to S3
exports.uploadProfilePic = async (file, AccountID) => {
  if (!file) {
    throw new Error("No profile picture provided for upload.");
  }

  if (!AccountID) {
    throw new Error("AccountID is required for profile picture upload.");
  }

  try {
    const data = await uploadFileToS3(file, `profile-pictures/${AccountID}`);
    console.log("Profile picture uploaded successfully:", data);
    return {
      message: "Profile picture uploaded successfully!",
      data,
    };
  } catch (error) {
    console.error("Error during profile picture upload:", error);
    throw new Error("Error uploading profile picture to S3.");
  }
};

// Handle program picture upload to S3
exports.uploadProgramPic = async (file, ProgramID) => {
  if (!file) {
    throw new Error("No program picture provided for upload.");
  }

  if (!ProgramID) {
    throw new Error("ProgramID is required for program picture upload.");
  }

  try {
    const data = await uploadFileToS3(file, `program-pics/${ProgramID}`);
    console.log("Program picture uploaded successfully:", data);
    return {
      message: "Program picture uploaded successfully!",
      data,
    };
  } catch (error) {
    console.error("Error during program picture upload:", error);
    throw new Error("Error uploading program picture to S3.");
  }
};
exports.uploadWebinar = async (file, WebinarID) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  if (!WebinarID) {
    throw new Error("WebinarID is required for file upload.");
  }

  try {
    const data = await uploadFileToS3(file, `webinar-pics/${WebinarID}`);
    console.log("Webinar picture uploaded successfully:", data);

    return {
      message: "File uploaded to S3 successfully!",
      data,
    };
  } catch (error) {
    console.error("Error during webinar picture upload:", error);
    throw new Error("Error processing file upload.");
  }
};

// Retrieve a file by OrderID
exports.getFileByOrderID = async (req, res) => {
  try {
    const { orderID } = req.params;
    if (!orderID) {
      return res.status(400).json({ error: "OrderID is required." });
    }

    const foldername = `PaymentInvoice/${orderID}`;
    try {
      const files = await listObjectsByPrefix(foldername);
      if (files.length === 0) {
        return res
          .status(404)
          .json({ error: "No files found for this OrderID." });
      }
      const url = await getSignedUrlFromS3(
        foldername,
        files[0].split("/").pop()
      );
      res.status(200).json({ url });
    } catch (error) {
      console.error("Error retrieving file:", error);
      res.status(500).json({ error: "Error retrieving file from S3." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected error occurred." });
  }
};

// Retrieve a profile picture by AccountID
exports.getProfilePicByAccountID = async (req, res) => {
  try {
    const { accountID } = req.params;
    if (!accountID) {
      return res.status(400).json({ error: "AccountID is required." });
    }

    const foldername = `profile-pictures/${accountID}`;
    try {
      const files = await listObjectsByPrefix(foldername);
      if (files.length === 0) {
        return res
          .status(404)
          .json({ error: "No profile picture found for this AccountID." });
      }
      const url = await getSignedUrlFromS3(
        foldername,
        files[0].split("/").pop()
      );
      res.status(200).json({ url });
    } catch (error) {
      console.error("Error retrieving profile picture:", error);
      res
        .status(500)
        .json({ error: "Error retrieving profile picture from S3." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected error occurred." });
  }
};

// Retrieve a program picture by ProgramID
exports.getProgramPicByProgramID = async (req, res) => {
  try {
    const { programID } = req.params;
    if (!programID) {
      return res.status(400).json({ error: "ProgramID is required." });
    }

    const foldername = `program-pics/${programID}`;
    try {
      const files = await listObjectsByPrefix(foldername);
      if (files.length === 0) {
        return res
          .status(404)
          .json({ error: "No program picture found for this ProgramID." });
      }
      const url = await getSignedUrlFromS3(
        foldername,
        files[0].split("/").pop()
      );
      res.status(200).json({ url });
    } catch (error) {
      console.error("Error retrieving program picture:", error);
      res
        .status(500)
        .json({ error: "Error retrieving program picture from S3." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected error occurred." });
  }
};
