// routes/programRoutes.js
const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");

// Route to get all programs
router.get("/", programController.getAllPrograms); 
// Route to get a single program by ID
router.get("/:id", programController.getProgramById); 
// Route to create a new program
router.post("/", programController.postProgram);
// Route to update a program by ID
router.put("/id/:id", programController.updateProgram);

module.exports = router;
