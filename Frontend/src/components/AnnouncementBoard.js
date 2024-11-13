import React, { useEffect, useState } from "react";

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements from your backend (Replace URL with actual endpoint)
  useEffect(() => {
    fetch("http://localhost:8000/announcement/") // Adjust the endpoint as per your backend setup
      .then((response) => response.json())
      .then((data) => setAnnouncements(data))
      .catch((error) => console.error("Error fetching announcements:", error));
  }, []);

  return (
    <div className="announcement-board">
      <h3 className="announcement-title">Latest Announcement</h3>
      {announcements.length > 0 ? (
        <div className="announcement-card">
          <h4>{announcements[0].Title}</h4> {/* Displaying the title */}
          <p className="announcement-date">
            Published on:{" "}
            {new Date(announcements[0].PostedDate).toLocaleDateString()}
          </p>
          <p>{announcements[0].Body}</p> {/* Displaying the body */}
        </div>
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
};

export default AnnouncementBoard;
