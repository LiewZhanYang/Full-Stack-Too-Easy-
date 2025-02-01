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

exports.getTotalForumEngagement = async (req, res) => {
  try {
    const engagement = await Workshop.getTotalForumEngagement();

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

exports.getTopProgramByType = async (req, res) => {
  try {
    const topProgramsByType = await Program.getTopProgramByType();

    if (!topProgramsByType.length) {
      return res
        .status(404)
        .json({ message: "No data found for program types." });
    }

    res.status(200).json(topProgramsByType);
  } catch (error) {
    console.error("Error fetching top programs by type:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// exports.getAverageRatingByProgram = async (req, res) => {
//   try {
//     const ratings = await Program.getAverageRatingByProgram();

//     if (!ratings.length) {
//       return res
//         .status(404)
//         .json({ message: "No ratings found for programs." });
//     }

//     res.status(200).json(ratings);
//   } catch (error) {
//     console.error("Error fetching average ratings by program:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

exports.getAverageRatingByProgramType = async (req, res) => {
  try {
    const ratings = await Program.getAverageRatingByProgramType();

    if (!ratings.length) {
      return res
        .status(404)
        .json({ message: "No ratings found for program types." });
    }

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching average ratings by program type:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAverageRatingForEachProgram = async (req, res) => {
  const { id } = req.params;
  try {
    const rating = await Program.getAverageRatingForEachProgram(id);

    if (!rating) {
      return res
        .status(404)
        .json({ message: "No rating found for this program." });
    }

    res.status(200).json(rating);
  } catch (error) {
    console.error("Error fetching rating for program:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getProgramsByIncome = async (req, res) => {
  try {
    const programs = await Program.getProgramsByIncome();

    if (!programs.length) {
      return res.status(404).json({ message: "No income data available." });
    }

    res.status(200).json(programs);
  } catch (error) {
    console.error("Error fetching programs ranked by income:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAverageRatingForAllPrograms = async (req, res) => {
  try {
    const programs = await Program.getAverageRatingForAllPrograms();

    if (!programs.length) {
      return res.status(404).json({ message: "No rating data available." });
    }

    res.status(200).json(programs);
  } catch (error) {
    console.error("Error fetching average ratings for all programs:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getNewSignUpsToday = async (req, res) => {
  try {
    const newSignUps = await Customer.getNewSignUpsToday();

    if (newSignUps === 0) {
      return res.status(404).json({ message: "No new sign-ups today." });
    }

    res.status(200).json({ newSignUps });
  } catch (error) {
    console.error("Error fetching new sign-ups:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getProgramAttendees = async (req, res) => {
  try {
    const { programName, programType, programTier } = req.query;
    const attendees = await Program.getProgramAttendees(programName, programType, programTier);
    
    if (!attendees.length) {
      return res.status(404).json({ message: "No attendees found for the specified filters." });
    }

    res.status(200).json(attendees);
  } catch (error) {
    console.error("Error fetching program attendees:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getHighestPayingCustomers = async (req, res) => {
  try {
    const customers = await Customer.getHighestPayingCustomers();

    if (!customers.length) {
      return res.status(404).json({ message: "No customer data found." });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching highest paying customers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getCustomerDataTable = async (req, res) => {
  try {
    const customers = await Customer.getCustomerDataTable();

    if (!customers.length) {
      return res.status(404).json({ message: "No customer data found." });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customer data table:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
