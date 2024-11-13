import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [expanded, setExpanded] = useState(false); // Track if the announcement is expanded

  // Fetch announcements from your backend
  useEffect(() => {
    fetch("http://localhost:8000/announcement/") // Adjust the endpoint as per your backend setup
      .then((response) => response.json())
      .then((data) => setAnnouncements(data))
      .catch((error) => console.error("Error fetching announcements:", error));
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb", // Soft background for the announcement board
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
      }}
      onClick={toggleExpand} // Toggle expand/collapse when clicked
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#374151", // Dark gray for the title
          }}
        >
          Latest Announcement
        </h3>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {expanded && announcements.length > 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            marginTop: "12px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827", // Strong text color for the announcement title
              marginBottom: "8px",
            }}
          >
            {announcements[0].Title}
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af", // Muted text color for the date
              marginBottom: "8px",
            }}
          >
            Published on:{" "}
            {new Date(announcements[0].PostedDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#4b5563", // Standard text color for the body
            }}
          >
            {announcements[0].Body}
          </p>
        </div>
      ) : expanded ? (
        <p
          style={{
            fontSize: "14px",
            color: "#9ca3af", // Muted color for empty state
            marginTop: "12px",
          }}
        >
          No announcements available.
        </p>
      ) : null}
    </div>
  );
};

export default AnnouncementBoard;
