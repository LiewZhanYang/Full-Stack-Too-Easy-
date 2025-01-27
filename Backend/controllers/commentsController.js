const Comments = require("../models/comments");

const postComment = async (req, res) => {
  const commentDetails = req.body;
  try {
    const newComment = await Comments.postComment(commentDetails);
    res.status(201).json(newComment);
    console.log("Successfully posted comment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting comment");
  }
};

const getCommentsByTicketID = async (req, res) => {
  const ticketID = req.params.ticketID;
  try {
    const comments = await Comments.getCommentsByTicketID(ticketID);
    res.status(200).json(comments);
    console.log("Successfully fetched comments for ticket:", ticketID);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching comments");
  }
};

module.exports = {
  postComment,
  getCommentsByTicketID,
};
