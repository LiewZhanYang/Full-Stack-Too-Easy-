// uploadmodel.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadFileToS3 = async (file, foldername) => {
  // Use original name or optionally modify the filename (e.g., adding a timestamp)
  const filename = `${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${foldername}/${filename}`, // Construct the path and file name in S3
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    console.log("Uploading file to S3 with params:", params); // Log for debugging
    const command = new PutObjectCommand(params);
    const result = await s3.send(command);
    console.log("File uploaded successfully to S3:", result); // Log upload success
    return result;
  } catch (error) {
    console.error("Error uploading file to S3:", error); // Improved error logging
    throw new Error("Error uploading file to S3");
  }
};
