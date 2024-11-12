// routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

router.get("/:id", sessionController.getSessionsByProgramID);
router.post("/", sessionController.postSession);
router.get("/sessionID/:sessionID", sessionController.getSessionBySessionID);

module.exports = router;
