// routes/programRoutes.js
const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");
const multer = require("multer");

// Configure Multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to get all programs
router.get("/", programController.getAllPrograms);
// Route to get a single program by ID
router.get("/:id", programController.getProgramById);

router.get("/signup/:id", programController.getProgramBySignUp);
router.get("/type/:typeID", programController.getProgramsByProgramType);
// Route to create a new program (with optional image upload)
router.post("/", upload.single("file"), programController.postProgram);

// Route to update a program by ID (with optional image upload)
router.put("/id/:id", upload.single("file"), programController.updateProgram);

router.delete("/:id", programController.deleteProgram);
router.get("/tier/:tierID", programController.getProgramByTierID);
router.get("/session/:sessionID", programController.getProgramBySessionID);
router.get("/tier/:tierid", programController.getProgramByTier);

module.exports = router;
