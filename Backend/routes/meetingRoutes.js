// routes/meetingRoutes.js
const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");

router.get("/create-meeting", meetingController.createMeeting);

module.exports = router;
