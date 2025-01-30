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
/*
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
*/
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
/*
exports.getWebPicByCategory = async (category) => {
  console.log(`📥 Received request to get web pic for category: ${category}`);

  if (!category) {
    console.error("❌ Category is missing from request.");
    throw new Error("Category is required.");
  }

  const validCategories = ["workshop", "camp", "entrepreneurs", "professional"];
  if (!validCategories.includes(category.toLowerCase())) {
    console.error(`❌ Invalid category: ${category}`);
    throw new Error(
      `Invalid category. Valid options: ${validCategories.join(", ")}`
    );
  }

  const foldername = `Web-Pics/${category}`;
  console.log(`📂 Looking for images in folder: ${foldername}`);

  try {
    const files = await exports.listObjectsByPrefix(foldername);
    console.log(`📝 Files found: ${files.length}`, files);

    // ✅ Filter out folders and keep only images
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageFiles = files.filter(
      (file) =>
        !file.endsWith("/") &&
        validExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      console.warn(`⚠️ No valid image files found for category: ${category}`);
      return { url: "/img/default.jpg" };
    }

    // ✅ Pick the first valid image file
    const selectedFile = imageFiles[0].split("/").pop(); // Extract filename
    console.log(`🔗 Selected image file: ${selectedFile}`);

    // ✅ Use the new function to get a properly formatted signed URL
    const url = await exports.getWebPicSignedUrl(foldername, selectedFile);
    console.log(`✅ Web image Signed URL generated: ${url}`);

    return { url };
  } catch (error) {
    console.error(`🚨 Error retrieving image for category ${category}:`, error);
    throw new Error(`Error retrieving image from S3: ${error.message}`);
  }
};
*/
/*
// Function to generate signed URL specifically for web images
exports.getWebPicSignedUrl = async (foldername, filename, expiresIn = 900) => {
  if (!foldername || !filename) {
    console.error(
      "❌ Missing foldername or filename for signed URL generation."
    );
    throw new Error(
      "Foldername and filename are required to generate a signed URL."
    );
  }

  const fileKey = `${foldername}/${filename}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    ResponseContentType: "image/jpeg",
    ResponseContentDisposition: "inline", // Ensures image opens in browser
  };

  try {
    console.log("🔄 Generating web-specific signed URL for S3 file:", params);
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn });

    console.log(`✅ Web-specific Signed URL: ${url}`);
    return url;
  } catch (error) {
    console.error("🚨 Error generating web image signed URL from S3:", error);
    throw new Error("Error generating web image signed URL from S3.");
  }
};
*/
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
