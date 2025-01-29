const express = require("express");
const router = express.Router();
const threadController = require("../controllers/threadController");

router.get("/", threadController.getThreads);
router.get("/:id/comment", threadController.getCommentByThreadID)
router.post("/comment", threadController.postComment);
router.post("/thread", threadController.postThread);
router.put("/like/:id", threadController.likeThread);
router.put("/dislike/:id", threadController.dislikeThread);
router.get("/:id", threadController.getThreadByID);

module.exports = router;
