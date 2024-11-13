import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

const Coaching = () => {
  const [roomUrl, setRoomUrl] = useState("");
  const { bookingID } = useParams();

  useEffect(() => {
    const fetchRoomUrl = async () => {
      if (!bookingID) return;
      try {
        const response = await fetch(
          `http://localhost:8000/booking/${bookingID}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching meeting URL: ${response.statusText}`);
        }

        const bookingData = await response.json();
        console.log("Fetched booking data:", bookingData);

        // Extract URL from the booking data array (assuming the first item is the relevant booking)
        if (bookingData.length > 0 && bookingData[0].URL) {
          setRoomUrl(bookingData[0].URL);
        } else {
          console.error("No URL found for this booking.");
        }
      } catch (error) {
        console.error("Error fetching meeting URL:", error);
      }
    };

    fetchRoomUrl();
  }, [bookingID]);

  return (
    <div className="container mt-1 precoaching-container p-4">
      <h2 className="precoaching-title">
        {roomUrl ? "1 to 1 Coaching" : "1 to 1 Coaching Waiting Room"}
      </h2>
      <hr style={{ borderTop: "1px solid #ccc", marginBottom: "1rem" }} />

      {roomUrl ? (
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
      ) : (
        <p className="text-muted text-start mt-3" style={{ fontSize: "1rem" }}>
          No meeting available currently, please wait for the admin to start a
          meeting. Thank you for your patience!
        </p>
      )}
    </div>
  );
};

export default Coaching;
