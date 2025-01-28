import React, { useEffect, useState } from "react";
import axios from "axios";

const Ticketing = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ category: "", content: "" });
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const userAccountID = localStorage.getItem("userId"); // Assume user ID is stored in localStorage

  // Fetch user tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/ticketing");
        // Filter tickets for the current user
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

  const handlePostTicket = async () => {
    if (!newTicket.category || !newTicket.content.trim()) {
      alert("Please fill in all fields!");
      return;
    }
  
    if (!["Payment", "Program", "Coaching", "General"].includes(newTicket.category)) {
      alert("Invalid category selected!");
      return;
    }
  
    try {
      const payload = {
        AccountID: userAccountID,
        Category: newTicket.category,
        Content: newTicket.content,
        StartDate: new Date().toISOString(),
        Status: "Open", // Default status
      };
  
      console.log("Payload:", payload); // Debugging payload
  
      const response = await axios.post("http://localhost:8000/ticketing", payload);
  
      if (response.status === 201) {
        setTickets((prev) => [...prev, response.data]);
        setNewTicket({ category: "", content: "" });
        alert("Ticket created successfully!");
      } else {
        console.error("Unexpected response:", response);
        alert("Failed to create ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error posting ticket:", error);
  
      if (error.response) {
        console.error("Backend Response:", error.response.data);
        alert("Error: " + error.response.data);
      } else {
        alert("An unexpected error occurred. Please check the console for details.");
      }
    }
  };
  
  // Add a comment to a ticket
  const handleAddComment = async (ticketID) => {
    if (!newComment[ticketID]?.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/ticketing/${ticketID}/comment`,
        {
          Body: newComment[ticketID],
          PostedBy: userAccountID,
          ReplyTo: ticketID,
        }
      );

      setComments((prev) => ({
        ...prev,
        [ticketID]: [...(prev[ticketID] || []), response.data],
      }));

      setNewComment((prev) => ({ ...prev, [ticketID]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3">Ticketing</h1>

      {/* Create Ticket Section */}
      <div className="border rounded p-4 my-4">
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
            <option value="Program">Program</option>
            <option value="Coaching">Coaching</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
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
        <button className="btn btn-warning text-white" onClick={handlePostTicket}>
          Submit
        </button>
      </div>

      {/* Tickets List */}
      <h5>Your Tickets</h5>
      {tickets.map((ticket) => (
        <div key={ticket.TicketID} className="border rounded p-4 mb-4">
          <div className="d-flex justify-content-between">
            <h6>{ticket.Category}</h6>
            <small className="text-muted">
              {new Date(ticket.StartDate).toLocaleDateString()}
            </small>
          </div>
          <p>{ticket.Content}</p>
          <p>
            <strong>Status:</strong> {ticket.Status}
          </p>

          {/* Comments Section */}
          <div className="mt-3">
            <h6>Comments</h6>
            {comments[ticket.TicketID]?.length > 0 ? (
              comments[ticket.TicketID].map((comment, index) => (
                <div key={index} className="border rounded p-2 mb-2">
                  <p className="mb-1">
                    <strong>{comment.PostedByName}</strong> on{" "}
                    {new Date(comment.CreatedOn).toLocaleDateString()}
                  </p>
                  <p>{comment.Body}</p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          {/* Add Comment Input */}
          <div className="mt-3 d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Add a comment..."
              value={newComment[ticket.TicketID] || ""}
              onChange={(e) =>
                setNewComment((prev) => ({
                  ...prev,
                  [ticket.TicketID]: e.target.value,
                }))
              }
            />
            <button
              className="btn btn-primary"
              onClick={() => handleAddComment(ticket.TicketID)}
            >
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ticketing;
