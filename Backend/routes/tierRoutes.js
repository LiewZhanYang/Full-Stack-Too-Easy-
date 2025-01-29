// routes/signupRoutes.js
const express = require("express");
const router = express.Router();
const tierController = require("../controllers/tierController");

router.get("/program/:programID", tierController.getTierByProgramID);
router.get("/:id", tierController.getTierByTierID);

router.put("/:id", tierController.updateTier);
router.post("/:programID", tierController.postTier);
router.delete("/:id", tierController.deleteTier);
module.exports = router;
