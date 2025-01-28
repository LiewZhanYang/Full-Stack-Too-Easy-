const Thread = require("../models/Thread");
const sentimentController = require("../controllers/sentimentController");

const getThreads = async (req, res) => {
    const { topic } = req.query; // Get topic from query parameter
    try {
      const threads = await Thread.getThreads(topic); // Pass topic to model
      res.status(200).json(threads);
    } catch (error) {
      console.error("Error retrieving threads:", error);
      res.status(500).json({ message: "Error retrieving threads" });
    }
  };
  
  const getThreadByID = async (req, res) => {
    try {
        const threadId = req.params.id;
        const thread = await Thread.getThreadByID(threadId);
        res.status(200).json(thread);
    } catch (error) {
        console.error("Error fetching thread by ID:", error);
        res.status(500).json({ error: error.message });
    }
};

  
  const getCommentByThreadID = async (req, res) => {
    const threadId = req.params.id;
    try {
        const comments = await Thread.getCommentByThreadID(threadId);
        res.status(200).json(comments);
    } catch (error) {
        console.error(`Error fetching comments for thread ID ${threadId}:`, error);
        res.status(500).json({ message: "Error fetching comments" });
    }
};


const postThread = async (req, res) => {
    const threadDetails = req.body;
    try {
        const newThread = await Thread.postThread(threadDetails);
        res.status(201).json(newThread);
        console.log("Successfully posted Thread");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error posting Thread");
    }
};

const postComment = async (req, res) => {
    const commentDetails = req.body;
    console.log("Received comment details:", commentDetails); // Add this line
    try {
        const newComment = await Thread.postComment(commentDetails);
        res.status(201).json(newComment);
        console.log("Successfully posted comment:", newComment);
    } catch (error) {
        console.error("Error posting comment:", error); // Log the full error
        res.status(500).send("Error posting comment");
    }
};



const likeThread = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await Thread.likeThread(id);
        console.log(result);
        res.json({ message: "Thread updated successfully" });
    } catch (error) {
        console.error("Error updating thread:", error);
        res.status(500).json({ message: "Error updating thread" });
    }
};

const dislikeThread = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await Thread.dislikeThread(id);
        res.json({ message: "Thread updated successfully" });
    } catch (error) {
        console.error("Error updating thread:", error);
        res.status(500).json({ message: "Error updating thread" });
    }
};



module.exports = {
    getThreads, 
    getThreadByID,
    getCommentByThreadID, 
    postThread,
    postComment,
    likeThread,
    dislikeThread
}