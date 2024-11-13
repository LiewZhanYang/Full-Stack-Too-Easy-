import React, { useEffect, useState } from "react";

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements from your backend (Replace URL with actual endpoint)
  useEffect(() => {
    fetch("/api/announcements") // Adjust the endpoint as per your backend setup
      .then((response) => response.json())
      .then((data) => setAnnouncements(data))
      .catch((error) => console.error("Error fetching announcements:", error));
  }, []);

  return (
    <div className="announcement-board">
      <h3 className="announcement-title">Latest Announcement</h3>
      {announcements.length > 0 ? (
        <div className="announcement-card">
          <h4>{announcements[0].title}</h4>
          <p className="announcement-date">
            Published on:{" "}
            {new Date(announcements[0].created_at).toLocaleDateString()}
          </p>
          <p>{announcements[0].body}</p>
        </div>
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
};

export default AnnouncementBoard;
