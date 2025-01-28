import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WorkshopForum = () => {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({ title: "", body: "", topic: "1" });
  const [customerName, setCustomerName] = useState("User");
  const [likedThreads, setLikedThreads] = useState(new Set()); // Tracks liked threads
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [viewedComments, setViewedComments] = useState(new Set()); // Tracks threads with visible comments
  const [commentInputs, setCommentInputs] = useState({}); // Tracks comment input values for each thread

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

  // Fetch threads with topic = 1
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get("http://localhost:8000/thread", {
          params: { topic: 1 }, // Filter threads by topic
        });

      // Fetch customer names for each thread
      const threadsWithNames = await Promise.all(
        response.data.map(async (thread) => {
          const customerResponse = await axios.get(
            `http://localhost:8000/customer/id/${thread.PostedBy}`
          );
          return {
            ...thread,
            PostedByName: customerResponse.data[0]?.Name || "Unknown", // Fetch and map name
            CreatedAt: thread.CreatedOn || null, // Use the CreatedAt field from the backend
            comments: thread.comments || [], // Ensure comments array exists
          };
        })
      );
        setThreads(threadsWithNames);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  // Handle input changes for creating threads
  const handleNewThreadChange = (e) => {
    const { name, value } = e.target;
    setNewThread((prev) => ({ ...prev, [name]: value }));
  };

  // Post a new thread
  const handlePostThread = async () => {
    try {
      const response = await axios.post("http://localhost:8000/thread/thread", {
        Title: newThread.title,
        Body: newThread.body,
        Topic: "1",
        PostedBy: userAccountID,
      });

      const newThreadWithName = {
        ...response.data,
        PostedByName: customerName,
        comments: [],
      };

      setThreads((prev) => [newThreadWithName, ...prev]);
      setNewThread({ title: "", body: "", topic: "1" });
      setShowCreateThread(false);
    } catch (error) {
      console.error("Error posting thread:", error);
    }
  };

  // Handle like functionality (users can only like once)
  const handleLikeThread = async (threadId) => {
    if (likedThreads.has(threadId)) {
      alert("You have already liked this thread.");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/thread/like/${threadId}`);
      setThreads((prev) =>
        prev.map((thread) =>
          thread.ThreadID === threadId
            ? { ...thread, Likes: thread.Likes + 1 }
            : thread
        )
      );
      setLikedThreads((prev) => new Set(prev.add(threadId))); // Track liked threads
    } catch (error) {
      console.error("Error liking thread:", error);
    }
  };



  const handleAddComment = async (threadId) => {
    const comment = commentInputs[threadId]?.trim();
    if (!comment) {
      alert("Comment cannot be empty!");
      return;
    }
  
    try {
      console.log("Posting comment:", {
        Body: comment,
        PostedBy: userAccountID,
        Topic: "1",
        ReplyTo: threadId,
      });
  
      // Post the comment to the backend
      const response = await axios.post("http://localhost:8000/thread/comment", {
        Body: comment,
        PostedBy: userAccountID,
        Topic: "1",
        ReplyTo: threadId,
      });
  
      console.log("Comment posted successfully:", response.data);
  
      // Fetch the user's name for the comment
      const customerResponse = await axios.get(
        `http://localhost:8000/customer/id/${userAccountID}`
      );
  
      const newComment = {
        ...response.data, // Ensure the backend includes CreatedAt in the response
        PostedByName: customerResponse.data[0]?.Name || "Unknown",
        CreatedAt: response.data.CreatedOn || new Date().toISOString(), // Fallback to current date if missing
      };
  
      // Update the thread's comments with the new comment
      setThreads((prev) =>
        prev.map((thread) =>
          thread.ThreadID === threadId
            ? { ...thread, comments: [...(thread.comments || []), newComment] }
            : thread
        )
      );
  
      // Clear the input for this thread's comment box
      setCommentInputs((prev) => ({ ...prev, [threadId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
  
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
    }
  };
  
  

  const toggleComments = async (threadId) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.ThreadID === threadId
          ? { ...thread, showComments: !thread.showComments } // Toggle visibility
          : thread
      )
    );
  
    try {
      const response = await axios.get(
        `http://localhost:8000/thread/${threadId}/comment`
      );
  
      const fetchedComments = response.data.map((comment) => ({
        ...comment,
        CreatedAt: comment.CreatedOn || new Date().toISOString(), // Fallback to current date
      }));
  
      setThreads((prev) =>
        prev.map((thread) =>
          thread.ThreadID === threadId
            ? { ...thread, comments: fetchedComments }
            : thread
        )
      );
    } catch (error) {
      console.error(`Error fetching comments for thread ID ${threadId}:`, error);
    }
  };
  

  
  
  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Workshop Forum</h1>
        <button
          onClick={() => setShowCreateThread(true)}
          className="btn btn-warning text-white"
        >
          Create Thread
        </button>
      </div>
  
      {/* Threads List */}
      {threads.map((thread) => (
        <div key={thread.ThreadID} className="card mb-4 shadow-sm">
          <div className="card-body">
            {/* Author Info and Thread Content */}
            <div className="d-flex align-items-start mb-3">
              <div
                className="rounded-circle bg-secondary me-3"
                style={{ width: "50px", height: "50px" }}
              ></div>
              <div>
                <h5 className="card-title">{thread.Title}</h5>
                <p className="text-muted mb-2 small">
                  Posted by: {thread.PostedByName || "Anonymous"} on{" "}
                  {thread.CreatedAt
                    ? new Date(thread.CreatedAt).toLocaleDateString()
                    : "Date unavailable"}
                </p>
                <p className="card-text">{thread.Body}</p>
              </div>
            </div>
  
            {/* Like and Comment Buttons */}
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => handleLikeThread(thread.ThreadID)}
                className="btn btn-warning text-white border-0 d-flex align-items-center gap-2"
              >
                <i className="bi bi-hand-thumbs-up"></i> {thread.Likes || 0}
              </button>
              <button
                onClick={() => toggleComments(thread.ThreadID)}
                className="btn btn-outline-secondary border-0 d-flex align-items-center gap-2"
              >
                <i className="bi bi-chat"></i> {thread.comments.length || 0}
              </button>
              <Link
                to={`/viewpost/${thread.ThreadID}`}
                className="btn btn-primary"
              >
                View Post
              </Link>
            </div>
  
            {/* Comments Section */}
            {thread.showComments && (
              <div className="mt-4">
                <h6 className="mb-3">Comments:</h6>
                {thread.comments && thread.comments.length > 0 ? (
                  thread.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-start mb-3 border p-2 rounded"
                    >
                      <div
                        className="rounded-circle bg-secondary me-2"
                        style={{ width: "40px", height: "40px" }}
                      ></div>
                      <div>
                        <p className="mb-1">
                          <strong>{comment.PostedByName}</strong> on{" "}
                          {new Date(comment.CreatedAt).toLocaleDateString()}
                        </p>
                        <p className="small text-muted">{comment.Body}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No comments yet.</p>
                )}
  
                {/* Add Comment Input */}
                <div className="d-flex align-items-center mt-3">
                  <div
                    className="rounded-circle bg-secondary me-2"
                    style={{ width: "40px", height: "40px" }}
                  ></div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add a comment..."
                    value={commentInputs[thread.ThreadID] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [thread.ThreadID]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleAddComment(thread.ThreadID)}
                    className="btn btn-primary ms-2"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
  
      {/* Create Thread Modal */}
      {showCreateThread && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Thread</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateThread(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Thread Title"
                  value={newThread.title}
                  onChange={(e) =>
                    setNewThread({ ...newThread, title: e.target.value })
                  }
                />
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Write your post..."
                  value={newThread.body}
                  onChange={(e) =>
                    setNewThread({ ...newThread, body: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateThread(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePostThread}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default WorkshopForum;
