import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch the thread details
        const postResponse = await axios.get(`http://localhost:8000/thread/${id}`);
        const thread = postResponse.data;
  
        // Fetch the name of the user who posted the thread
        let PostedByName = "Anonymous"; // Default to Anonymous
        if (thread.PostedBy) {
          try {
            const userResponse = await axios.get(
              `http://localhost:8000/customer/id/${thread.PostedBy}`
            );
            PostedByName = userResponse.data[0]?.Name || "Anonymous";
          } catch (error) {
            console.warn("Error fetching poster's name:", error);
          }
        }
  
        setPost({ ...thread, PostedByName });
  
        // Fetch comments
        const commentsResponse = await axios.get(
          `http://localhost:8000/thread/${id}/comment`
        );
  
        // Process comments
        const commentsWithNames = await Promise.all(
          commentsResponse.data.map(async (comment) => {
            let commenterName = "Anonymous";
            if (comment.PostedBy) {
              try {
                const commenterResponse = await axios.get(
                  `http://localhost:8000/customer/id/${comment.PostedBy}`
                );
                commenterName = commenterResponse.data[0]?.Name || "Anonymous";
              } catch (error) {
                console.warn(`Error fetching commenter name for ID ${comment.PostedBy}:`, error);
              }
            }
            return {
              ...comment,
              PostedByName: commenterName,
              CreatedAt: comment.CreatedOn || new Date().toISOString(),
            };
          })
        );
  
        setComments(commentsWithNames);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
  
    fetchPostDetails();
  }, [id]);
  

  const handleAddComment = async () => {
    if (!commentInput.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      // Post the comment to the backend
      const response = await axios.post("http://localhost:8000/thread/comment", {
        Body: commentInput,
        PostedBy: localStorage.getItem("userId"), // Assume userId is stored
        Topic: "1",
        ReplyTo: id,
      });

      // Fetch the user's name for the new comment
      const customerResponse = await axios.get(
        `http://localhost:8000/customer/id/${localStorage.getItem("userId")}`
      );
      const newComment = {
        ...response.data,
        PostedByName: customerResponse.data[0]?.Name || "Anonymous",
        CreatedAt: response.data.CreatedOn || new Date().toISOString(),
      };

      setComments((prev) => [...prev, newComment]);
      setCommentInput("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold mb-0">Workshop Forum</h1>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <img
              src="/api/placeholder/40/40"
              className="rounded-circle"
              alt="User avatar"
              style={{ width: "40px", height: "40px", backgroundColor: "#E9ECEF" }}
            />
          </div>
          <div>
            <h6 className="mb-0">{post.PostedByName}</h6>
            <small className="text-muted">
              {new Date(post.CreatedOn).toLocaleDateString()}
            </small>
          </div>
        </div>

        <h4 className="fw-bold mb-3">{post.Title}</h4>
        <p className="mb-3">{post.Body}</p>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-warning text-white border-0 d-flex align-items-center gap-2">
            <i className="bi bi-hand-thumbs-up"></i> {post.Likes || 0}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="btn btn-outline-secondary border-0 d-flex align-items-center gap-2"
          >
            <i className="bi bi-chat"></i> {comments.length || 0}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mb-4">
          <h6 className="mb-3">Comments</h6>
          {comments.map((comment, index) => (
            <div key={index} className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <div className="me-3">
                  <img
                    src="/api/placeholder/40/40"
                    className="rounded-circle"
                    alt="Commenter avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#E9ECEF",
                    }}
                  />
                </div>
                <div>
                  <h6 className="mb-0">{comment.PostedByName}</h6>
                  <small className="text-muted">
                    {new Date(comment.CreatedAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
              <p className="mb-0 ms-5 ps-2">{comment.Body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Section */}
      <div className="border rounded p-3">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <div className="text-end">
          <button onClick={handleAddComment} className="btn btn-warning text-white px-4">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
