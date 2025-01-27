const Tier = require("../models/tier");

// Retrieve a tier by ID
const getTierByProgramID = async (req, res) => {
  const id = req.params.id;
  try {
    const tier = await Tier.getTierByProgramID(id);
    if (!tier) {
      return res.status(404).json({ message: "Tier not found" });
    }
    res.json(tier);
  } catch (error) {
    console.error("Error fetching tier:", error);
    res.status(500).json({ message: "Error retrieving tier" });
  }
};
// Retrieve a tier by TierID
const getTierByTierID = async (req, res) => {
  const id = req.params.id;
  try {
    const tier = await Tier.getTierByTierID(id);
    if (!tier) {
      return res.status(404).json({ message: "Tier not found" });
    }
    res.json(tier);
  } catch (error) {
    console.error("Error fetching tier:", error);
    res.status(500).json({ message: "Error retrieving tier" });
  }
};

// Post a new tier
const postTier = async (req, res) => {
  const programID = parseInt(req.params.programID);
  const tierDetails = req.body;
  console.log("Received tier details:", tierDetails);

  try {
    // Create the new tier in the database
    const newTier = await Tier.postTier(programID, tierDetails);

    res.status(201).json(newTier);
  } catch (error) {
    console.error("Error posting tier:", error);
    res.status(500).send("Error posting tier");
  }
};

// Update an existing tier
const updateTier = async (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;

  try {
    // Update tier data in the database
    const result = await Tier.updateTier(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tier not found" });
    }
    res.json({ message: "Tier updated successfully" });
  } catch (error) {
    console.error("Error updating tier:", error);
    res.status(500).json({ message: "Error updating tier" });
  }
};

const deleteTier = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedTier = await Tier.deleteTier(id);
    res.status(201).json(deletedTier);
    console.log("Successfully deleted Tier");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getTierByProgramID,
  getTierByTierID,
  postTier,
  updateTier,
  deleteTier,
};
