const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.postReview);
router.get("/:id", reviewController.getReviewsByProgram);
router.get("/program/:accountID", reviewController.getProgramIDFromReview);

module.exports = router;
