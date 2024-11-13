// routes/signupRoutes.js
const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");

router.get("/", announcementController.getAllAnnouncement);
router.get("/:id", announcementController.getAnnouncementByID);
router.put("/:id", announcementController.updateAnnouncement)
router.post("/", announcementController.postAnnouncement);
router.delete("/:id", announcementController.deleteAnnouncement);

module.exports = router;