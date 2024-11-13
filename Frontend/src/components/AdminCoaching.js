// AdminCoaching.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminCoaching = () => {
  const [roomUrl, setRoomUrl] = useState("");

  useEffect(() => {
    localStorage.removeItem("roomUrl");
  }, []);

  const createMeeting = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/meeting/create-meeting"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Meeting Data:", data);
      setRoomUrl(data.roomUrl);
      localStorage.setItem("roomUrl", data.roomUrl);
    } catch (error) {
      console.error("Error starting meeting:", error);
    }
  };

  return (
    <div className="container mt-1 precoaching-container p-4">
      <h2 className="precoaching-title">
        {roomUrl ? "Admin Coaching Session" : "Start Coaching Session"}
      </h2>
      <hr style={{ borderTop: "1px solid #ccc", marginBottom: "1rem" }} />

      {!roomUrl ? (
        <div className="mt-4">
          <button
            className="btn btn-primary mb-4"
            onClick={createMeeting}
            style={{ fontSize: "1.2rem", padding: "0.6rem 1.5rem" }}
          >
            Start Meeting
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="alert alert-success p-3">
            <p>Meeting URL created! You can now join the meeting.</p>
          </div>

          <iframe
            src={roomUrl}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            style={{
              width: "100%",
              height: "500px",
              border: "0",
              marginTop: "20px",
            }}
            title="Whereby Meeting"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default AdminCoaching;
