const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.post("/", commentsController.postComment);
router.get("/:ticketID", commentsController.getCommentsByTicketID);

module.exports = router;
