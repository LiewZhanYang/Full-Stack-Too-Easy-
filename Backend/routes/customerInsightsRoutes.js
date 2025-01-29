const express = require("express");
const router = express.Router();
const customerInsightsController = require("../controllers/customerInsightsController");

// Route to get top-paying customers
router.get("/", customerInsightsController.getTopPayingCustomers);
router.get("/most-popular", customerInsightsController.getMostPopularWorkshop);

module.exports = router;
