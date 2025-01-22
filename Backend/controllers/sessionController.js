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
  const sessionDetails = req.body;
  try {
    const newSession = await Session.postSession(sessionDetails);
    res.status(201).json(newSession);
    console.log("Successfully posted Session");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting session");
  }
};

const updateSession = async (req, res) => {
  const sessionID = req.params.id;
  const sessionDetails = req.body; // Program data to be updated

  try {
    const result = await Session.updateSession(sessionID, sessionDetails);

    if (result.affectedRows === 0) {
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
    const deletedSession = await Session.deleteSession(SessionID);
    res.status(201).json(deletedSession);
    console.log("Successfully deleted Session");
  } catch (error) {
    console.error(error);
    res.status(403).send("Unable to delete session as it has payments for it");
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

module.exports = {
  getSessionsByTierID,
  postSession,
  updateSession,
  deleteSession,
  getSessionBySessionID,
};
