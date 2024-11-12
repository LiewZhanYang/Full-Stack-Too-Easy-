const Session = require("../models/session");

const getSessionsByProgramID = async (req, res) => {
  const programID = req.params.id;
  try {
    const sessions = await Session.getSessionsByProgramID(programID);
    if (sessions.length === 0) {
      return res.status(404).send("Sessions not found");
    }
    res.json(sessions);
  } catch (error) {
    console.error(error);
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

module.exports = { getSessionsByProgramID, postSession, getSessionBySessionID};
