// routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

router.get("/:id", sessionController.getSessionsByTierID);
router.post("/", sessionController.postSession);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);
router.get("/sessionID/:sessionID", sessionController.getSessionBySessionID);
router.get(
  "/program/:programId",
  sessionController.getSessionsByProgramAndTier
);
router.put("/:id/cancel", sessionController.handleCancelSession);

module.exports = router;
