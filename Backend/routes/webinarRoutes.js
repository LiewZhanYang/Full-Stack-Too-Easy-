// routes/signupRoutes.js
const express = require("express");
const router = express.Router();
const webinarController = require("../controllers/webinarController");

router.get("/", webinarController.getAllWebinar);
router.get("/:id", webinarController.getAllWebinarByID);
router.put("/:id", webinarController.updateWebinar)
router.post("/", webinarController.postWebinar);
router.delete("/:id", webinarController.deleteWebinar);

module.exports = router;