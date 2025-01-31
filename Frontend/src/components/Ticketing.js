import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Ticketing = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ category: "", content: "" });
  const [showCreateTicket, setShowCreateTicket] = useState(false); // For collapsible form
  const userAccountID = localStorage.getItem("userId"); // Assume user ID is stored in localStorage
  const navigate = useNavigate(); // React Router's navigation hook



  // Fetch user tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/ticketing");
        const userTickets = response.data.filter(
          (ticket) => ticket.AccountID === parseInt(userAccountID)
        );
        setTickets(userTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [userAccountID]);

  // Create a new ticket
  const handlePostTicket = async () => {
    if (!newTicket.category || !newTicket.content.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    if (!["Payment", "Technical", "Other", "General"].includes(newTicket.category)) {
      alert("Invalid category selected!");
      return;
    }

    try {
      const payload = {
        AccountID: userAccountID,
        Category: newTicket.category,
        Content: newTicket.content,
        StartDate: new Date().toISOString(),
        Status: "Open",
      };

      const response = await axios.post("http://localhost:8000/ticketing", payload);

      if (response.status === 201) {
        setTickets((prev) => [...prev, response.data]);
        setNewTicket({ category: "", content: "" });
        alert("Ticket created successfully!");
      } else {
        alert("Failed to create ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error posting ticket:", error);
    }
  };

  // Navigate to ticket details page
  const handleViewTicket = (ticketID) => {
    navigate(`/ticket/${ticketID}`); // Navigate to the ticket details page
  };

  return (
    <div className="container py-4">
      <h1 className="h3">Ticketing</h1>

      {/* Collapsible Create Ticket Section */}
      <div className="border rounded p-4 my-4">
        <button
          className="btn btn-warning text-white"
          onClick={() => setShowCreateTicket((prev) => !prev)}
        >
          {showCreateTicket ? "Hide Create Ticket" : "Create a Ticket"}
        </button>
        {showCreateTicket && (
          <div className="mt-4">
            <h5>Create a Ticket</h5>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="form-select"
                value={newTicket.category}
                onChange={(e) =>
                  setNewTicket((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">Select</option>
                <option value="Payment">Payment</option>
                <option value="Technical">Technical</option>
                <option value="General">General</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Subject
              </label>
              <textarea
                id="content"
                className="form-control"
                rows="3"
                value={newTicket.content}
                onChange={(e) =>
                  setNewTicket((prev) => ({ ...prev, content: e.target.value }))
                }
              ></textarea>
            </div>
            <button
              className="btn btn-primary"
              onClick={handlePostTicket}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Tickets Table */}
      <h5>Your Tickets</h5>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Subject</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket.TicketID}>
                <td>{ticket.Category}</td>
                <td>{ticket.Content}</td>
                <td>{ticket.Status}</td>
                <td>{new Date(ticket.StartDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewTicket(ticket.TicketID)}
                  >
                    View Ticket
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Ticketing;
