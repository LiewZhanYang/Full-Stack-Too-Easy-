const express = require("express");
const router = express.Router();
const customerInsightsController = require("../controllers/customerInsightsController");

// Route to get top-paying customers
router.get("/", customerInsightsController.getTopPayingCustomers);
router.get("/most-popular", customerInsightsController.getMostPopularWorkshop);
router.get(
  "/get-rating/:id",
  customerInsightsController.getAverageRatingByWorkshop
);
router.get(
  "/engagement/:id",
  customerInsightsController.getTotalForumEngagementToday
);
router.get("/top-programs", customerInsightsController.getTopPrograms);
router.get(
  "/top-programs-by-type",
  customerInsightsController.getTopProgramByType
);
router.get(
  "/average-rating/programs",
  customerInsightsController.getAverageRatingByProgram
);
router.get(
  "/average-rating/program-types",
  customerInsightsController.getAverageRatingByProgramType
);
router.get(
  "/average-rating/program/:id",
  customerInsightsController.getAverageRatingForEachProgram
);

router.get(
  "/programs-by-income",
  customerInsightsController.getProgramsByIncome
);

router.get(
  "/average-rating/all-programs",
  customerInsightsController.getAverageRatingForAllPrograms
);

module.exports = router;
