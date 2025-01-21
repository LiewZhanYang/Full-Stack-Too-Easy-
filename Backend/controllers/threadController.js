const Thread = require("../models/Thread");
const sentimentController = require("../controllers/sentimentController");

const getThreads = async (req, res) => {
    try {
        const threads = await Thread.getThreads();
        res.status(200).json(threads);
    } catch (error) {
        console.error("Error retrieving threads:", error);
        res.status(500).json({ message: "Error retrieving threads" });
    }
};

const getCommentByThreadID = async (req, res) => {
    const id = req.params.id;
    try {
        const threads = await Thread.getCommentByThreadID(id);
        res.status(200).json(threads);
    } catch (error) {
        console.error("Error retrieving threads:", error);
        res.status(500).json({ message: "Error retrieving threads" });
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
    try {
        const newComment = await Thread.postComment(commentDetails);
        res.status(201).json(newComment);
        console.log("Successfully posted Comment");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error posting Comment");
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
    getCommentByThreadID, 
    postThread,
    postComment,
    likeThread,
    dislikeThread
}