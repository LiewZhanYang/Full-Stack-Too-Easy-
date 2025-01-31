const express = require("express");
const router = express.Router();
const ticketingController = require("../controllers/ticketingController");

router.post("/", ticketingController.postTicket);
router.get("/", ticketingController.getTickets);
router.get("/:ticketID", ticketingController.getTicketById); // New route
router.put("/:ticketID/status", ticketingController.updateTicketStatus);
router.post("/:ticketID/comments", ticketingController.addComment)
router.get("/:ticketID/comments", ticketingController.getComments);

module.exports = router;
