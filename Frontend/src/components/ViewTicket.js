import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewTicket = () => {
  const { id } = useParams(); // Get the ticket ID from the route
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [customerName, setCustomerName] = useState(""); // State for customer name
  const userAccountID = localStorage.getItem("userId"); // Assume user ID is stored in localStorage

  // Fetch customer name
  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/customer/id/${userAccountID}` // API to get customer by ID
        );
        if (response.data && response.data.length > 0) {
          setCustomerName(response.data[0].Name || "User");
        }
      } catch (error) {
        console.error("Error fetching customer name:", error);
      }
    };

    if (userAccountID) fetchCustomerName();
  }, [userAccountID]);

  // Fetch ticket details and comments
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const ticketResponse = await axios.get(
          `http://localhost:8000/ticketing/${id}`
        );
        setTicket(ticketResponse.data);

        const commentsResponse = await axios.get(
          `http://localhost:8000/ticketing/${id}/comments`
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8000/ticketing/${id}/comments`,
        {
          Content: newComment,       // Match the "Content" column
          CommenterID: userAccountID, // Match the "CommenterID" column
          IsAdmin: 0,                // Optional: If the user is not an admin
        }
      );
  
      setComments((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };
  

  if (!ticket) {
    return <div>Loading ticket details...</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="h3">Ticketing</h1>
      <div className="border rounded p-4 my-4">
        {/* Customer Name */}
        <div className="mb-4">
          <h5>{customerName}</h5>
        </div>

        {/* Ticket Details */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h6>{ticket.PostedByName}</h6>
            <small className="text-muted">
              {new Date(ticket.StartDate).toLocaleDateString()}
            </small>
          </div>
          <p>
            <strong>Category:</strong>{" "}
            <span className="badge bg-secondary">{ticket.Category}</span>
          </p>
          <p>{ticket.Content}</p>
        </div>

        {/* Comments Section */}
        <div className="mb-4">
  <h6>Comments</h6>
  {comments.length > 0 ? (
    comments.map((comment, index) => (
      <div key={index} className="border rounded p-3 mb-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{customerName}</h6>
          <small className="text-muted">
            {/* Ensure proper date formatting */}
            {comment.CommentDate
              ? new Date(comment.CommentDate).toLocaleString()
              : "Invalid Date"}
          </small>
        </div>
        <p className="mb-0">{comment.Content || "No Content"}</p>
      </div>
    ))
  ) : (
    <p>No comments yet.</p>
  )}
</div>

        {/* Add a Comment */}
        <div className="mt-4">
          <h6>Add a Comment</h6>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="btn btn-warning text-white"
              onClick={handleAddComment}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
