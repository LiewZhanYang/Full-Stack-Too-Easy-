import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Precoaching() {
  return (
    <div className="container mt-5 precoaching-container p-4">
      <h2 className="precoaching-title">1 to 1 Virtual Coaching Session</h2>
      <hr style={{ borderTop: "1px solid #ccc", marginBottom: "1rem" }} />
      <p
        className="text-muted"
        style={{ fontSize: "1rem", marginBottom: "1rem" }}
      >
        You have 1 upcoming session
      </p>

      {/* Session Details */}
      <div className="mt-4">
        <h6 style={{ fontWeight: 500, color: "#333" }}>1 April 2025</h6>
        <br></br>
        <div className="card shadow-sm p-3 mb-3 bg-light rounded border-0 session-details-card">
          <div className="row mb-3">
            <div className="col-4 text-start">
              <p className="mb-1" style={{ fontWeight: 500 }}>
                Starts
              </p>
              <p>13:00</p>
            </div>
            <div className="col-4 text-start">
              <p className="mb-1" style={{ fontWeight: 500 }}>
                End
              </p>
              <p>14:00</p>
            </div>
            <div className="col-4 text-start">
              <p className="mb-1" style={{ fontWeight: 500 }}>
                Coach
              </p>
              <p>aaaaaaa</p>
            </div>
          </div>
          <p className="text-start" style={{ color: "#555" }}>
            <strong>Status:</strong> You can join the meeting now.
          </p>

          <div className="d-flex justify-content-start mt-3">
            <button
              className="btn btn-warning me-3 px-4 join-button"
              style={{ fontWeight: 500 }}
            >
              Join
            </button>
            <button
              className="btn btn-outline-secondary px-4 cancel-button"
              style={{ fontWeight: 500 }}
            >
              Cancel
            </button>
          </div>
        </div>
        <p
          className="text-muted text-center mt-3"
          style={{ fontSize: "0.85rem" }}
        >
          <i className="bi bi-info-circle me-1"></i> Only one session may be
          booked at a time.
        </p>
      </div>
    </div>
  );
}

export default Precoaching;