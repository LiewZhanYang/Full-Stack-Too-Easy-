import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Fetch announcements from your backend
  useEffect(() => {
    fetch("http://localhost:8000/announcement/") // Adjust the endpoint as per your backend setup
      .then((response) => response.json())
      .then((data) => {
        const filteredAnnouncements = data.filter((announcement) => {
          const publishedDate = new Date(announcement.PostedDate);
          const currentDate = new Date();
          const timeDifference = currentDate - publishedDate;
          const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert ms to days
          return daysDifference <= 20;
        });
        setAnnouncements(filteredAnnouncements);
      })
      .catch((error) => console.error("Error fetching announcements:", error));
  }, []);

  // Update current announcement index every 5 seconds
  useEffect(() => {
    if (expanded && announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncementIndex((prevIndex) =>
          prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [expanded, announcements.length]);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setCurrentAnnouncementIndex(0); // Reset to the first announcement when expanded
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
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
            color: "#374151",
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
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            {announcements[currentAnnouncementIndex].Title}
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginBottom: "8px",
            }}
          >
            Published on:{" "}
            {new Date(
              announcements[currentAnnouncementIndex].PostedDate
            ).toLocaleDateString("en-US", {
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#4b5563",
            }}
          >
            {announcements[currentAnnouncementIndex].Body}
          </p>
        </div>
      ) : expanded ? (
        <p
          style={{
            fontSize: "14px",
            color: "#9ca3af",
            marginTop: "12px",
          }}
        >
          No recent announcements available.
        </p>
      ) : null}
    </div>
  );
};

export default AnnouncementBoard;
