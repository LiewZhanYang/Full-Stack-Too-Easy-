import React, { useState, useEffect } from "react";
import { Container, Form, Card, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminViewAnnouncement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [sortedAnnouncements, setSortedAnnouncements] = useState([]);
  const [sortOption, setSortOption] = useState("Latest");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

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

  const handleDeleteClick = (id) => {
    setAnnouncementToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (announcementToDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/announcement/${announcementToDelete}`
        );
        alert("Announcement deleted successfully");

        fetchAnnouncements();
        setShowConfirmModal(false);
        setAnnouncementToDelete(null);
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
    <Container fluid className="admin-announcements-page p-4">
      <h2 className="precoaching-title">Announcements</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span style={{ fontSize: "0.9em" }}>Sort by:</span>
        <Form.Select
          value={sortOption}
          onChange={handleSortChange}
          className="sort-select"
          style={{ width: "200px" }}
        >
          <option value="Latest">Latest</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </Form.Select>
      </div>

      {sortedAnnouncements.map((announcement) => (
        <Card key={announcement.AnnouncementID} className="mb-3 shadow-sm text-start">
          <Card.Body>
            <Card.Title>{announcement.Title}</Card.Title>
            <Card.Text>{new Date(announcement.PostedDate).toLocaleDateString()}</Card.Text>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Text className="mb-0">ID: {announcement.AnnouncementID}</Card.Text>
              <div className="d-flex gap-2">
                <Button
                  variant="light"
                  className="d-flex align-items-center"
                  onClick={() => handleViewClick(announcement.AnnouncementID)}
                >
                  <FaEye className="me-1" /> View
                </Button>
                <Button
                  variant="light"
                  className="d-flex align-items-center"
                  onClick={() => handleEditClick(announcement.AnnouncementID)}
                >
                  <FaEdit className="me-1" /> Edit
                </Button>
                <Button
                  variant="danger"
                  className="d-flex align-items-center"
                  onClick={() => handleDeleteClick(announcement.AnnouncementID)}
                >
                  <FaTrash className="me-1" /> Delete
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          Are you sure you want to delete this announcement?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminViewAnnouncement;
