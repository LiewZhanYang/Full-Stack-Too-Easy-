const express = require("express");
const router = express.Router();
const ticketingController = require("../controllers/ticketingController");

router.post("/", ticketingController.postTicket);
router.get("/", ticketingController.getTickets);
router.put("/:ticketID/status", ticketingController.updateTicketStatus);

module.exports = router;
