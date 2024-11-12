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

// Utility function to upload files to S3
const uploadToS3 = async (file, keyPrefix) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${keyPrefix}/${file.originalname}`, // Construct the S3 key
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  console.log("Uploading file to S3 with params:", params);
  const command = new PutObjectCommand(params);
  return await s3.send(command);
};

// Handle file upload to S3 and trigger email
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const OrderID = req.body.OrderID;

    if (!file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please provide a file." });
    }

    try {
      // Upload file to S3
      const data = await uploadToS3(
        file,
        `PaymentInvoice/${OrderID}/${file.originalname}`
      );
      console.log("File uploaded successfully:", data);

      // Trigger email after successful upload
      const emailResponse = await sendEmailNotification(
        process.env.ADMIN_EMAIL,
        file.originalname
      );

      res.status(200).json({
        message: "File uploaded to S3 and email notification sent!",
        data,
        emailResponse,
      });
    } catch (error) {
      console.error("Error during file upload or email notification:", error);
      res.status(500).json({ error: "Error processing file upload." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ error: "Unexpected error occurred during file upload." });
  }
};

// Handle profile picture upload to S3
exports.uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;
    const userID = req.body.AccountID;

    if (!file) {
      return res
        .status(400)
        .json({ error: "No profile picture uploaded. Please provide a file." });
    }

    try {
      // Upload profile picture to S3
      const data = await uploadToS3(
        file,
        `profile-pictures/${AccountID}/${file.originalname}`
      );
      console.log("Profile picture uploaded successfully:", data);

      res.status(200).json({
        message: "Profile picture uploaded successfully!",
        data,
      });
    } catch (error) {
      console.error("Error during profile picture upload:", error);
      res.status(500).json({ error: "Error uploading profile picture to S3." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      error: "Unexpected error occurred during profile picture upload.",
    });
  }
};
exports.uploadProgramPic = async (req, res) => {
  try {
    const file = req.file;
    const ProgramID = req.body.ProgramID; // Assuming ProgramID is passed in the request body

    if (!file) {
      return res
        .status(400)
        .json({ error: "No program picture uploaded. Please provide a file." });
    }

    try {
      // Upload program picture to S3
      const data = await uploadToS3(
        file,
        `program-pics/${ProgramID}/${file.originalname}`
      );
      console.log("Program picture uploaded successfully:", data);

      res.status(200).json({
        message: "Program picture uploaded successfully!",
        data,
      });
    } catch (error) {
      console.error("Error during program picture upload:", error);
      res.status(500).json({ error: "Error uploading program picture to S3." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      error: "Unexpected error occurred during program picture upload.",
    });
  }
};
