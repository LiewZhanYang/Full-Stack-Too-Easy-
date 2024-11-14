const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload files to S3
exports.uploadFileToS3 = async (file, foldername) => {
  const filename = `${file.originalname}`; // Generate unique filename using timestamp

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${foldername}/${filename}`, // S3 path including folder and filename
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    console.log("Uploading file to S3 with params:", params);
    const command = new PutObjectCommand(params);
    const result = await s3.send(command);
    console.log("File uploaded successfully to S3:", result);
    return { filename, s3Result: result };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Error uploading file to S3");
  }
};
exports.uploadFileToS3 = async (file, foldername) => {
  // Define a consistent filename, e.g., 'profile-picture' or 'main-image'
  // This ensures that only one file is present per folder and replaces previous uploads.
  const filename = "only-you"; // Fixed name or set a meaningful name for each context

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${foldername}/${filename}`, // S3 path including folder and filename
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    console.log("Uploading file to S3 with params:", params);
    const command = new PutObjectCommand(params);
    const result = await s3.send(command);
    console.log("File uploaded successfully to S3:", result);
    return { filename, s3Result: result };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Error uploading file to S3");
  }
};

// Function to generate a signed URL for accessing a file in S3
exports.getSignedUrlFromS3 = async (foldername, filename, expiresIn = 900) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${foldername}/${filename}`,
  };

  try {
    console.log("Generating signed URL for S3 file:", params);
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn }); // 900 seconds = 15 minutes
    return url;
  } catch (error) {
    console.error("Error generating signed URL from S3:", error);
    throw new Error("Error generating signed URL from S3");
  }
};

// Function to list objects by prefix (e.g., for retrieving program pics by ID)
exports.listObjectsByPrefix = async (prefix) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: prefix,
    });
    const data = await s3.send(command);

    // Return empty array if no files are found
    if (!data.Contents || data.Contents.length === 0) {
      console.warn(`No files found for the specified prefix: ${prefix}`);
      return [];
    }

    return data.Contents.map((content) => content.Key);
  } catch (error) {
    console.error("Error listing objects from S3:", error);
    throw new Error("Error listing objects from S3");
  }
};
