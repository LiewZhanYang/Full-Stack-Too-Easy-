import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Card, Button, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminViewAnnouncement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/announcement/");
      setAnnouncements(response.data);
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
        await axios.delete(`http://localhost:8000/announcement/${announcementToDelete}`);
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

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  const filterAnnouncements = () => {
    const currentDate = new Date();
    if (activeTab === "active") {
      return announcements.filter(
        (announcement) => new Date(announcement.PostedDate) >= currentDate
      );
    } else if (activeTab === "past") {
      return announcements.filter(
        (announcement) => new Date(announcement.PostedDate) < currentDate
      );
    }
    return announcements;
  };

  const renderAnnouncements = () => {
    const filteredAnnouncements = filterAnnouncements();

    if (activeTab === "active" && filteredAnnouncements.length === 0) {
      return <p ><br></br>No upcoming announcements.</p>;
    }

    return filteredAnnouncements.map((announcement) => (
      <Card
        key={announcement.AnnouncementID}
        className="admin-payment-card mb-3 p-3"
        style={{ cursor: "pointer" }}
      >
        <Card.Body>
          <Card.Title className="admin-payment-order-id">{announcement.Title}</Card.Title>
          <Card.Text className="admin-payment-text">{new Date(announcement.PostedDate).toLocaleDateString()}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Text>ID: {announcement.AnnouncementID}</Card.Text>
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
    ));
  };

  return (
    <Container fluid className="admin-payments-page p-4">
      <h2 className="admin-payments-title">Announcements</h2>
      <hr className="admin-payments-divider mb-4" />

      {/* Tabs for Active and Past Announcements */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={handleTabSelect}
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="active"
            className="admin-payments-tab"
            style={{
              color: activeTab === "active" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "active" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom: activeTab === "active" ? "2px solid #f59e0b" : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.3s ease, border-bottom-color 0.3s ease",
            }}
          >
            Active
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="past"
            className="admin-payments-tab"
            style={{
              color: activeTab === "past" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "past" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom: activeTab === "past" ? "2px solid #f59e0b" : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.3s ease, border-bottom-color 0.3s ease",
            }}
          >
            Past
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col>{renderAnnouncements()}</Col>
      </Row>

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
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminViewAnnouncement;
