const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

router.get("/sessions", sessionController.getAllSessions);
router.get("/sessions/:id", sessionController.getSessionById);
router.post("/sessions", sessionController.createSession);
router.put("/sessions/:id", sessionController.updateSession);
router.delete("/sessions/:id", sessionController.deleteSession);

module.exports = router;
