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
exports.getWebinarPicByWebinarID = async (req, res) => {
  const { webinarID } = req.params;

  if (!webinarID) {
    return res.status(400).json({ error: "WebinarID is required." });
  }

  const foldername = `webinar-pics/${webinarID}`;

  try {
    console.log(`📂 Fetching images from: ${foldername}`);

    const files = await listObjectsByPrefix(foldername);

    console.log(`📝 Files found: ${files.length}`, files);

    // ✅ Filter only valid image formats
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageFiles = files.filter(
      (file) =>
        !file.endsWith("/") &&
        validExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      console.warn(`⚠️ No images found for Webinar ID: ${webinarID}`);
      return res.json({ url: "/img/default.jpg" });
    }

    // ✅ Select the first image file
    const selectedFile = imageFiles[0].split("/").pop();
    console.log(`🔗 Selected image file: ${selectedFile}`);

    const signedUrl = await getSignedUrlFromS3(foldername, selectedFile);
    console.log(`✅ Signed URL generated: ${signedUrl}`);

    res.json({ url: signedUrl });
  } catch (error) {
    console.error(
      `❌ Error retrieving image for WebinarID ${webinarID}:`,
      error
    );
    res
      .status(500)
      .json({ error: "Error retrieving webinar picture from S3." });
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

    if (!files || files.length === 0) {
      throw new Error("No files found for this OrderID.");
    }

    // ✅ Filter out folders and keep only actual files
    const validExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".docx"]; // Allowed file types
    const fileList = files.filter((file) =>
      validExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );

    if (fileList.length === 0) {
      throw new Error("No valid files found for this OrderID.");
    }

    // ✅ Select the first valid file
    const selectedFile = fileList[0].split("/").pop(); // Extract filename
    console.log(`🔗 Selected file for signed URL: ${selectedFile}`);

    // ✅ Generate the signed URL
    const url = await getSignedUrlFromS3(foldername, selectedFile);
    return { url };
  } catch (error) {
    console.error("❌ Error retrieving file:", error);
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
exports.getProgramPicByProgramID = async (req, res) => {
  const { programID } = req.params;

  if (!programID) {
    return res.status(400).json({ error: "ProgramID is required." });
  }

  const foldername = `program-pics/${programID}`;

  try {
    console.log(`📂 Fetching images from: ${foldername}`);

    const files = await listObjectsByPrefix(foldername);

    console.log(`📝 Files found: ${files.length}`, files);

    // ✅ Filter out folders and keep only images
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageFiles = files.filter(
      (file) =>
        !file.endsWith("/") &&
        validExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      console.warn(`⚠️ No images found for Program ID: ${programID}`);
      return res.json({ url: "/img/default.jpg" });
    }

    // ✅ Pick the first valid image file
    const selectedFile = imageFiles[0].split("/").pop(); // Extract filename
    console.log(`🔗 Selected image file: ${selectedFile}`);

    const signedUrl = await getSignedUrlFromS3(foldername, selectedFile);

    console.log(`✅ Signed URL generated: ${signedUrl}`);

    res.json({ url: signedUrl });
  } catch (error) {
    console.error(
      `❌ Error retrieving image for ProgramID ${programID}:`,
      error
    );
    res
      .status(500)
      .json({ error: "Error retrieving program picture from S3." });
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
/*
exports.getWebPicByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`📢 API hit: GET /web-pics/${category}`);

    if (!category) {
      console.error("❌ Error: Category parameter is missing.");
      return res.status(400).json({ error: "Category is required." });
    }

    console.log(`🔄 Fetching image for category: ${category}`);

    // Fetch image from the model
    const image = await require("../models/upload").getWebPicByCategory(
      category
    );
    console.log(`✅ Image found and returned: ${JSON.stringify(image)}`);

    res.status(200).json(image);
  } catch (error) {
    console.error(
      `🚨 Error in API response for category ${req.params.category}:`,
      error
    );
    res.status(500).json({ error: error.message || "Internal server error." });
  }
};
*/
