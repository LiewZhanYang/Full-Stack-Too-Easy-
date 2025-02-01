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
router.get("/engagement", customerInsightsController.getTotalForumEngagement);

router.get("/top-programs", customerInsightsController.getTopPrograms);
router.get(
  "/top-programs-by-type",
  customerInsightsController.getTopProgramByType
);
//router.get(
//"/average-rating/programs",
//customerInsightsController.getAverageRatingByProgram
//);
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

router.get("/new-signups", customerInsightsController.getNewSignUpsToday);

router.get("/program-attendees", customerInsightsController.getProgramAttendees);
router.get("/highest-paying-customers", customerInsightsController.getHighestPayingCustomers);
router.get("/customer-data-table", customerInsightsController.getCustomerDataTable);

module.exports = router;
