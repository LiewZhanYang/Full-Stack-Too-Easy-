const express = require("express");
const router = express.Router();
const ticketingController = require("../controllers/ticketingController");

router.post("/", ticketingController.postTicket);
router.get("/", ticketingController.getTickets);

module.exports = router;
