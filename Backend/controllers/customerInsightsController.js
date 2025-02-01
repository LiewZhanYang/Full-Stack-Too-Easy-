const Customer = require("../models/customer");
const Workshop = require("../models/workshop");
const Program = require("../models/program");

exports.getTopPayingCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5; // Default to 5 if no limit provided
    const topCustomers = await Customer.getTopPayingCustomers(limit);

    if (topCustomers.length === 0) {
      return res.status(404).json({ message: "No customers found." });
    }

    res.status(200).json(topCustomers); // Respond with the top customers
  } catch (error) {
    console.error("Error fetching top-paying customers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getMostPopularWorkshop = async (req, res) => {
  try {
    const mostPopularWorkshop = await Workshop.getMostPopularWorkshop();

    if (!mostPopularWorkshop) {
      return res
        .status(404)
        .json({ message: "No workshops found in the last 6 months." });
    }

    res.status(200).json(mostPopularWorkshop);
  } catch (error) {
    console.error("Error fetching most popular workshop:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAverageRatingByWorkshop = async (req, res) => {
  const { id } = req.params;
  try {
    const averageRating = await Workshop.getAverageRatingByWorkshop(id);

    if (!averageRating) {
      return res
        .status(404)
        .json({ message: "No rating was given for this workshop." });
    }

    res.status(200).json(averageRating);
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getTotalForumEngagementToday = async (req, res) => {
  const { id } = req.params;
  try {
    const engagement = await Workshop.getTotalForumEngagementToday(id);

    if (!engagement) {
      return res.status(404).json({ message: "No engagement" });
    }

    res.status(200).json(engagement);
  } catch (error) {
    console.error("Error fetching engagement:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getTopPrograms = async (req, res) => {
  try {
    const topPrograms = await Program.getTopPrograms();

    if (!topPrograms.length) {
      return res.status(404).json({ message: "No programs found." });
    }

    res.status(200).json(topPrograms);
  } catch (error) {
    console.error("Error fetching top programs:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
