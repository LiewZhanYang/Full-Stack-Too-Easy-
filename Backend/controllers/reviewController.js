const Review = require("../models/review");


const getProgramIDFromReview = async (req, res) => {
    try {
        const accountID = req.params.accountID;
        const programData = await Review.getProgramIDFromReview(accountID);

        if (!programData) {
            return res.status(404).json({ message: "No review found for this user" });
        }

        res.json(programData);
    } catch (error) {
        console.error("Error retrieving ProgramID from reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getReviewsByProgram = async (req, res) => {
    const id = req.params.id;
    console.log(`Program ID: ${id}`); // Debugging line
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
    postReview,
    getProgramIDFromReview,
}