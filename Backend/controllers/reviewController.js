const Review = require("../models/review");
const reviewController = require("../controllers/reviewController");

const getReviewsByProgram = async (req, res) => {
    const id = req.params.id;
    try {
        const reviews = await Review.getReviewsByProgram(id);
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error retrieving reviews:", error);
        res.status(500).json({ message: "Error retrieving reviews" });
    }
};

const postReview = async (req, res) => {
    const reviewDetails = req.body;
    try {
        const newReview = await Review.postReview(reviewDetails);
        res.status(201).json(newReview);
        console.log("Successfully posted Review");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error posting Review");
    }
};

module.exports = {
    getReviewsByProgram,
    postReview
}