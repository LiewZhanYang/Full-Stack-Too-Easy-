const Customer = require("../models/customer");
const Workshop = require("../models/workshop");

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
