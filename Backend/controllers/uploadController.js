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
    /*
    const emailResponse = await sendEmailNotification(
      process.env.ADMIN_EMAIL,
      file.originalname
    );
    return {
      message: "File uploaded to S3 and email notification sent!",
      data,
      emailResponse,
    };
    */
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
exports.uploadDocument = async (file, TransferID) => {
  if (!file) {
    throw new Error("No document provided for upload.");
  }

  if (!AccountID) {
    throw new Error("TransferID is required for upload.");
  }

  try {
    const data = await uploadFileToS3(file, `Transfer-Request/${TransferID}`);
    console.log("document uploaded successfully:", data);
    return {
      message: "document uploaded successfully!",
      data,
    };
  } catch (error) {
    console.error("Error during document upload:", error);
    throw new Error("Error uploading document to S3.");
  }
};
exports.getFileByWebinarID = async (WebinarID) => {
  if (!WebinarID) {
    throw new Error("WebinarID is required.");
  }

  const foldername = `webinar-pics/${WebinarID}`;
  try {
    // List objects in the specified folder in S3
    const files = await listObjectsByPrefix(foldername);
    if (files.length === 0) {
      throw new Error("No files found for this WebinarID.");
    }

    // Generate a signed URL for the first file
    const url = await getSignedUrlFromS3(foldername, files[0].split("/").pop());
    return { url };
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw new Error("Error retrieving file from S3.");
  }
};
// Retrieve a file by OrderID
exports.getFileByOrderID = async (orderID) => {
  if (!orderID) {
    throw new Error("OrderID is required.");
  }

  const foldername = `PaymentInvoice/${orderID}`;
  try {
    const files = await listObjectsByPrefix(foldername);
    if (files.length === 0) {
      throw new Error("No files found for this OrderID.");
    }

    // Generate the signed URL for the first file
    const url = await getSignedUrlFromS3(foldername, files[0].split("/").pop());
    return { url };
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw new Error("Error retrieving file from S3.");
  }
};

// Retrieve a profile picture by AccountID
exports.getProfilePicByAccountID = async (accountID) => {
  if (!accountID) {
    throw new Error("AccountID is required.");
  }

  const foldername = `profile-pictures/${accountID}`;
  try {
    const files = await listObjectsByPrefix(foldername);
    if (files.length === 0) {
      console.warn(`No profile picture found for AccountID: ${accountID}`);
      return { url: "/img/default-profile.jpg" }; // Return a default image or null if no files are found
    }
    const url = await getSignedUrlFromS3(foldername, files[0].split("/").pop());
    return { url };
  } catch (error) {
    console.error(
      `Error retrieving profile picture for AccountID ${accountID}:`,
      error
    );
    throw new Error("Error retrieving profile picture from S3.");
  }
};
// Updated getProgramPicByProgramID function
exports.getProgramPicByProgramID = async (programID) => {
  if (!programID) {
    throw new Error("ProgramID is required.");
  }

  const foldername = `program-pics/${programID}`;
  try {
    const files = await listObjectsByPrefix(foldername);
    if (files.length === 0) {
      // Return a default image URL or null if no files are found
      console.warn(`No images found for ProgramID: ${programID}`);
      return { url: "/img/default.jpg" }; // Adjust this to your needs
    }

    // Generate the signed URL for the first file
    const url = await getSignedUrlFromS3(foldername, files[0].split("/").pop());
    return { url };
  } catch (error) {
    console.error(
      `Error retrieving program picture for ProgramID ${programID}:`,
      error
    );
    throw new Error("Error retrieving program picture from S3.");
  }
};

exports.getdocumentByTransferID = async (TransferID) => {
  if (!TransferID) {
    throw new Error("TransferID is required.");
  }

  const foldername = `Transfer-Request/${TransferID}`;
  try {
    const files = await listObjectsByPrefix(foldername);
    if (files.length === 0) {
      // Return a default image URL or null if no files are found
      console.warn(`No document found for TransferID: ${TransferID}`);
      return { url: "/img/default.jpg" }; // Adjust this to your needs
    }

    // Generate the signed URL for the first file
    const url = await getSignedUrlFromS3(foldername, files[0].split("/").pop());
    return { url };
  } catch (error) {
    console.error(
      `Error retrieving document for TransferID ${TransferID}:`,
      error
    );
    throw new Error("Error retrieving document from S3.");
  }
};
