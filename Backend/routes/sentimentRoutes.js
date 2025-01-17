const express = require("express");
const { analyzeSentiment } = require("../controllers/sentimentController");

const router = express.Router();

// POST /api/sentiment
router.post("/", analyzeSentiment);

module.exports = router;
