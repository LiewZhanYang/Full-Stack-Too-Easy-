// uploadRoutes.js
const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // ✅ Accept file
  } else {
    cb(new Error("Invalid file type. Allowed: Images, PDFs, DOCX"), false); // ❌ Reject file
  }
};

const upload = multer({ storage, fileFilter });

// Endpoint for uploading a single file
router.post(
  "/file",
  upload.single("file"), // Middleware for handling single file uploads (field name: 'file')
  uploadController.uploadFile
);
router.post("/file", upload.single("file"), uploadController.uploadDocument);
router.post(
  "/profile-pic",
  upload.single("file"), // Middleware to handle single file upload (file field name is 'file')
  uploadController.uploadProfilePic
);
router.post(
  "/program-pic",
  upload.single("file"), // Middleware for handling single file upload (field name: 'file')
  uploadController.uploadProgramPic
);
router.get("/file/:orderID", uploadController.getFileByOrderID);
router.post(
  "/webinar-pic",
  upload.single("file"), // Middleware for handling single file upload (field name: 'file')
  uploadController.uploadWebinar
);
// Route to get a profile picture by AccountID
router.get(
  "/profile-pic/:accountID",
  uploadController.getProfilePicByAccountID
);

// Route to get a program picture by ProgramID
router.get(
  "/program-pic/:programID",
  uploadController.getProgramPicByProgramID
);
router.get(
  "/webinar-pic/:webinarID",
  uploadController.getWebinarPicByWebinarID
);
/*
router.get(
  "/:category",
  (req, res, next) => {
    console.log(`📡 Incoming GET request: /web-pics/${req.params.category}`);
    next();
  },
  uploadController.getWebPicByCategory
);
*/
module.exports = router;
