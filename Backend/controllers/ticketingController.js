const Ticketing = require("../models/ticketing");

const postTicket = async (req, res) => {
  const ticketDetails = req.body;
  try {
    const newTicket = await Ticketing.postTicket(ticketDetails);
    res.status(201).json(newTicket);
    console.log("Successfully posted ticket");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting ticket");
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticketing.getTickets();
    res.status(200).json(tickets);
    console.log("Successfully fetched tickets");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tickets");
  }
};

module.exports = {
  postTicket,
  getTickets,
};
