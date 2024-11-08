// Imports
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { sendEmailNotification } = require("./emailcontroller"); // Import the email function
require("dotenv").config(); // Load environment variables

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
console.log("Configured to send email from:", process.env.GMAIL_USER); // Confirm sender email setup

// Upload function
exports.uploadFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `PaymentInvoice/${file.originalname}`, // Define the path and file name in S3
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    console.log("Attempting to upload file to S3 with params:", params);
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("File uploaded successfully:", data);

    // Trigger email after successful upload
    await sendEmailNotification(
      process.env.ADMIN_EMAIL, // Recipient's email from environment variable
      file.originalname // File name in email content
    );

    res.status(200).json({
      message: "File uploaded to S3 and email notification sent!",
      data,
    });
  } catch (error) {
    console.error("Error during upload or email notification:", error);
    res.status(500).send("Error uploading file or sending email notification.");
  }
};
