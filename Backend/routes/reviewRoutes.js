const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.postReview);
router.get("/:id", reviewController.getReviewsByProgram);

module.exports = router;
