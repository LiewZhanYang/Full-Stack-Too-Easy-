// routes/programRoutes.js
const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");

router.get("/", programController.getAllPrograms);
router.post("/", programController.postProgram);

module.exports = router;
