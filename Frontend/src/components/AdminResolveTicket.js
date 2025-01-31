import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminResolveTicket = () => {
  const { id } = useParams(); // Get ticket ID from route
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [customerName, setCustomerName] = useState(""); // State for customer name
  const [commenters, setCommenters] = useState({}); // State to store commenter names
  const adminId = localStorage.getItem("adminId"); // Fetch admin ID from localStorage

  // Fetch ticket details and comments
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const ticketResponse = await axios.get(
          `http://localhost:8000/ticketing/${id}`
        );
        setTicket(ticketResponse.data);

        if (ticketResponse.data.AccountID) {
          const customerResponse = await axios.get(
            `http://localhost:8000/customer/id/${ticketResponse.data.AccountID}`
          );
          if (customerResponse.data && customerResponse.data.length > 0) {
            setCustomerName(customerResponse.data[0].Name || "User");
          }
        }

        const commentsResponse = await axios.get(
          `http://localhost:8000/ticketing/${id}/comments`
        );
        setComments(commentsResponse.data);

        // Fetch commenter names
        const commenterIds = [
          ...new Set(commentsResponse.data.map((c) => c.CommenterID)),
        ];
        const commenterNames = {};
        for (const commenterId of commenterIds) {
          const res = await axios.get(
            `http://localhost:8000/customer/id/${commenterId}`
          );
          if (res.data.length > 0) {
            commenterNames[commenterId] = res.data[0].Name;
          }
        }
        setCommenters(commenterNames);
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
    const adminId = localStorage.getItem("adminId");
    console.log("Admin ID retrieved from localStorage:", adminId);

    try {
      const response = await axios.post(
        `http://localhost:8000/ticketing/${id}/comments`,
        {
          Content: newComment, // Content of the comment
          CommenterID: adminId ? parseInt(adminId, 10) : null, // Use the admin ID dynamically
          IsAdmin: 1, // Indicates the comment is from an admin
        }
      );

      setComments((prev) => [...prev, response.data]);
      setNewComment("");
      // If ticket is open, update status to "In Progress"
      if (ticket.Status === "Open") {
        await axios.put(`http://localhost:8000/ticketing/${id}/status`, {
          Status: "In Progress",
        });
        setTicket((prev) => ({ ...prev, Status: "In Progress" }));
      }
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
      <h1 className="h3">Admin Resolve Ticket</h1>
      <div className="border rounded p-4 my-4">
        {/* Ticket Details */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Posted by: {customerName}</h6>
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
                  <h6 className="mb-0">
                    <strong>
                      {comment.IsAdmin
                        ? "Admin"
                        : commenters[comment.CommenterID] || "Customer"}
                    </strong>
                  </h6>
                  <small className="text-muted">
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
        {/* Close Ticket Button */}
        <div className="mt-4 text-end">
          <button
            className="btn btn-danger"
            onClick={async () => {
              try {
                await axios.put(
                  `http://localhost:8000/ticketing/${id}/status`,
                  {
                    Status: "Resolved",
                  }
                );
                alert("Ticket has been resolved.");
                setTicket((prev) => ({ ...prev, Status: "Resolved" }));
              } catch (error) {
                console.error("Error closing ticket:", error);
                alert("Failed to close ticket. Please try again.");
              }
            }}
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminResolveTicket;
