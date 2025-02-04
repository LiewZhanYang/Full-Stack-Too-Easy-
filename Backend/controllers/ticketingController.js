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


//Fetch ticket by TicketID
const getTicketById = async (req, res) => {
  const ticketID = req.params.ticketID;

  try {
    const ticket = await Ticketing.getTicketById(ticketID);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
    console.log(`Successfully fetched ticket with ID ${ticketID}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching ticket by ID");
  }
};

const addComment = async (req, res) => {
  const { ticketID } = req.params;
  const { Content, CommenterID, IsAdmin = 0 } = req.body;

  try {
    const comment = await Ticketing.addComment(ticketID, Content, CommenterID, IsAdmin);
    console.log("Comment Response Sent to Frontend:", comment); // Log the response
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error in controller while adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getComments = async (req, res) => {
  const { ticketID } = req.params;

  try {
    const comments = await Ticketing.getComments(ticketID);

    // If no comments are found, return an empty array
    if (!comments.length) {
      return res.status(200).json([]); // Respond with an empty array
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  postTicket,
  getTickets,
  updateTicketStatus,
  getTicketById,
  addComment,
  getComments,
};
