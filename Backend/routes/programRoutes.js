const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");

// Route to add a program
router.post("/programs", programController.addProgram);

// Route to get a program by ID
router.get("/programs/:id", programController.getProgramById);

// Route to update a program by ID
router.put("/programs/:id", programController.updateProgram);

// Route to delete a program by ID
router.delete("/programs/:id", programController.deleteProgram);

module.exports = router;
