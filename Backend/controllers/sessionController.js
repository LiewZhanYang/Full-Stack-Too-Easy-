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

module.exports = { getSessionsByProgramID, postSession };
