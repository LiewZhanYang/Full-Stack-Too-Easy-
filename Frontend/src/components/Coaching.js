import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Coaching = () => {
  const [roomUrl, setRoomUrl] = useState("");

  useEffect(() => {
    const fetchRoomUrl = () => {
      const savedRoomUrl = localStorage.getItem("roomUrl");
      if (savedRoomUrl) {
        setRoomUrl(savedRoomUrl);
      }
    };
    fetchRoomUrl();

    const fetchInterval = setInterval(fetchRoomUrl, 15000);
    return () => clearInterval(fetchInterval);
  }, []);

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
