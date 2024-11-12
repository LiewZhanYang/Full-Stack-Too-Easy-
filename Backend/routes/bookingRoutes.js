// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.postBooking);
router.get("/:id", bookingController.getBookingByAccountID);
router.delete("/:id", bookingController.deleteBookingByBookingID);
router.get("/", bookingController.getAllBooking)

module.exports = router;
