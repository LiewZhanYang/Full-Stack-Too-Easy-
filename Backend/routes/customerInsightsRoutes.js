const express = require("express");
const router = express.Router();
const customerInsightsController = require("../controllers/customerInsightsController");

// Route to get top-paying customers
router.get("/", customerInsightsController.getTopPayingCustomers);
router.get("/most-popular", customerInsightsController.getMostPopularWorkshop);
router.get("/get-rating/:id", customerInsightsController.getAverageRatingByWorkshop);
router.get("/engagement/:id", customerInsightsController.getTotalForumEngagementToday);
router.get("/top-programs", customerInsightsController.getTopPrograms);

module.exports = router;
