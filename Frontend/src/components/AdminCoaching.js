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
    <div className="container mt-5">
      <button
        className="btn btn-primary mb-4"
        onClick={createMeeting}
        style={{ fontSize: "1.2rem", padding: "0.6rem 1.5rem" }}
      >
        Start Meeting
      </button>

      {roomUrl && (
        <div className="mt-3">
          <p className="alert alert-success">
            Meeting URL created! You and customers can now join the meeting.
          </p>
          <p>
            <strong>Room URL:</strong>{" "}
            <a href={roomUrl} target="_blank" rel="noopener noreferrer">
              {roomUrl}
            </a>
          </p>
          <button
            className="btn btn-success mt-2"
            onClick={() => setRoomUrl(roomUrl)}
          >
            Join Meeting
          </button>
        </div>
      )}

      {roomUrl && (
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
      )}
    </div>
  );
};

export default AdminCoaching;
