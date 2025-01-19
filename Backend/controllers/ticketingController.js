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

const updateTicketStatus = async (req, res) => {
  const ticketID = req.params.ticketID;
  const { Status } = req.body;

  try {
    const result = await Ticketing.updateTicketStatus(ticketID, Status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket status updated successfully" });
    console.log(`Ticket ${ticketID} status updated to ${Status}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating ticket status");
  }
};

module.exports = {
  postTicket,
  getTickets,
  updateTicketStatus,
};
