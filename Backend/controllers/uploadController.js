const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { sendEmailNotification } = require("../controllers/emailController");
const multer = require("multer");

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer storage (store file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for file upload
exports.uploadSingleFile = upload.single("file");

// Handle file upload to S3 and trigger email
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const OrderID = req.body.OrderID;
    console.log(req);
    console.log(OrderID);
    // Check if a file was uploaded
    if (!file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please provide a file." });
    }

    // Use the original file name
    const filename = file.originalname;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${OrderID}/${filename}`, // Define the path and file name in S3
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      console.log("Attempting to upload file to S3 with params:", params);
      const command = new PutObjectCommand(params);
      const data = await s3.send(command);
      console.log("File uploaded successfully:", data);

      // Trigger email after successful upload using the original filename
      try {
        const emailResponse = await sendEmailNotification(
          process.env.ADMIN_EMAIL,
          filename
        );
        res.status(200).json({
          message: "File uploaded to S3 and email notification sent!",
          data,
          emailResponse,
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        res.status(500).json({
          error: "File uploaded but failed to send email notification.",
        });
      }
    } catch (s3Error) {
      console.error("Error during S3 file upload:", s3Error);
      res.status(500).json({ error: "Error uploading file to S3." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ error: "Unexpected error occurred during file upload." });
  }
};
