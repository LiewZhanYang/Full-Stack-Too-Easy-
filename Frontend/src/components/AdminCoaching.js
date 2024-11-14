import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

const AdminCoaching = () => {
  const { bookingID } = useParams();
  const [roomUrl, setRoomUrl] = useState("");

  const createMeeting = async () => {
    try {
      console.log("Creating Meeting...");
      const response = await fetch(
        "http://localhost:8000/meeting/create-meeting"
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Meeting URL created:", data.roomUrl);

      setRoomUrl(data.roomUrl);

      // Use the new method to update the booking with the room URL
      console.log(
        `Updating Booking ID: ${bookingID} with URL: ${data.roomUrl}`
      );
      const updateResponse = await fetch(
        `http://localhost:8000/booking/${bookingID}`, 
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ URL: data.roomUrl }),
        }
      );

      if (updateResponse.ok) {
        console.log("Successfully updated booking URL in database.");
      } else {
        const errorText = await updateResponse.text();
        console.error("Failed to update booking URL in database:", errorText);
      }
    } catch (error) {
      console.error("Error starting meeting or updating URL:", error);
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
          onClick={createMeeting}
          style={{
            backgroundColor: "#fbbf24",
            color: "black",
            borderRadius: "8px",
            padding: "0.6rem 1.5rem",
            fontSize: "1.2rem",
            fontWeight: "500",
            textDecoration: "none",
            transition: "background-color 0.2s ease-in-out",
            cursor: "pointer",
            border: "none",
            marginTop: "20px", // Adds space above the button to move it down if needed
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
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
