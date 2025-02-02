const Session = require("../models/session");

const getSessionsByTierID = async (req, res) => {
  const tierID = req.params.id;
  try {
    console.log(`Fetching sessions for TierID: ${tierID}`);
    const sessions = await Session.getSessionsByTierID(tierID);
    console.log(`Sessions retrieved:`, sessions);
    if (sessions.length === 0) {
      return res.status(404).send("No sessions found for this TierID");
    }
    res.json(sessions);
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    res.status(500).send("Error retrieving sessions");
  }
};

const postSession = async (req, res) => {
  try {
    const newSession = await Session.postSession(req.body);

    if (newSession.error) {
      return res.status(400).json({ error: newSession.error });
    }

    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error posting session" });
  }
};

const updateSession = async (req, res) => {
  const sessionID = req.params.id;
  const {
    StartDate,
    EndDate = null,
    Time = null,
    Location = null,
    Vacancy = null,
    Status = null,
    TierID = null,
  } = req.body;

  // Validate required fields
  if (StartDate === undefined) {
    return res
      .status(400)
      .json({ message: "StartDate is required and cannot be undefined." });
  }

  const sessionDetails = {
    StartDate,
    EndDate,
    Time,
    Location,
    Vacancy,
    Status,
    TierID,
  };

  // Log the session details for debugging
  console.log("Session Details:", sessionDetails);

  try {
    const result = await Session.updateSession(sessionID, sessionDetails);

    if (!result) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Session updated successfully" });
  } catch (error) {
    console.error("Error updating Session:", error);
    res.status(500).json({ message: "Error updating Session" });
  }
};

const deleteSession = async (req, res) => {
  const SessionID = req.params.id;
  try {
    const result = await Session.deleteSession(SessionID);
    if (!result) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    if (error.message.includes("Payments are associated")) {
      return res.status(403).json({
        message: "Cannot delete session as it has associated payments.",
      });
    }
    res.status(500).json({ message: "Error deleting session" });
  }
};

const getSessionBySessionID = async (req, res) => {
  const sessionID = req.params.sessionID;

  try {
    const session = await Session.getSessionBySessionID(sessionID);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Error fetching session" });
  }
};

const getSessionsByProgramAndTier = async (req, res) => {
  const { programId } = req.params;
  const { tier } = req.query;

  if (!programId || !tier) {
    return res
      .status(400)
      .json({ error: "Missing required parameters: programId and tier." });
  }

  try {
    const sessions = await Session.getSessionsByProgramAndTier(programId, tier);
    if (sessions.length === 0) {
      return res.status(404).json({
        error: "No sessions found for the specified program and tier.",
      });
    }
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions." });
  }
};

const getAffectedCustomers = async (req, res) => {
  const { id } = req.params;

  try {
    const results = await Session.getAffectedCustomers(id);
    res.json(results);
  } catch (error) {
    console.error("Error fetching affected customers:", error);
    res.status(500).send("Error fetching affected customers");
  }
};

module.exports = {
  getSessionsByTierID,
  postSession,
  updateSession,
  deleteSession,
  getSessionBySessionID,
  getSessionsByProgramAndTier,
  getAffectedCustomers, // Add this import
};
