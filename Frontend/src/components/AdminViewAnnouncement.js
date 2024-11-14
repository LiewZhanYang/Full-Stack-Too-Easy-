import React, { useState, useEffect } from "react";
import { Container, Form, Card, Button } from "react-bootstrap";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminViewAnnouncement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [sortedAnnouncements, setSortedAnnouncements] = useState([]);
  const [sortOption, setSortOption] = useState("Latest");

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/announcement/");
      setAnnouncements(response.data);
      setSortedAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`http://localhost:8000/announcement/${id}`);
        alert("Announcement deleted successfully");

        // Refresh the list after deletion
        fetchAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
        alert("There was an error deleting the announcement.");
      }
    }
  };

  const handleViewClick = (id) => {
    navigate(`/admin-view-single-announcement/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/admin-edit-announcement/${id}`);
  };

  const handleSortChange = (event) => {
    const option = event.target.value;
    setSortOption(option);
    sortAnnouncements(option);
  };

  const sortAnnouncements = (option) => {
    let sorted = [...announcements];
    if (option === "Month") {
      sorted.sort(
        (a, b) =>
          new Date(a.PostedDate).getMonth() - new Date(b.PostedDate).getMonth()
      );
    } else if (option === "Year") {
      sorted.sort(
        (a, b) =>
          new Date(b.PostedDate).getFullYear() -
          new Date(a.PostedDate).getFullYear()
      );
    }
    setSortedAnnouncements(sorted);
  };

  return (
    <Container fluid className="admin-view-announcement p-4">
      <h2 className="mb-4">Announcements</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span>Latest</span>
        <Form.Select
          value={sortOption}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="Latest">Sort by</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </Form.Select>
      </div>

      {sortedAnnouncements.map((announcement) => (
        <Card key={announcement.AnnouncementID} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>Title: {announcement.Title}</Card.Title>
            <Card.Text>
              Date Created:{" "}
              {new Date(announcement.PostedDate).toLocaleDateString()}
            </Card.Text>
            <Card.Text>id : {announcement.AnnouncementID}</Card.Text>
            <div className="d-flex justify-content-end">
              <Button
                variant="light"
                className="me-2"
                onClick={() => handleViewClick(announcement.AnnouncementID)}
              >
                <FaEye />
              </Button>
              <Button
                variant="light"
                className="me-2"
                onClick={() => handleEditClick(announcement.AnnouncementID)}
              >
                <FaEdit />
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteClick(announcement.AnnouncementID)}
              >
                <FaTrash />
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default AdminViewAnnouncement;