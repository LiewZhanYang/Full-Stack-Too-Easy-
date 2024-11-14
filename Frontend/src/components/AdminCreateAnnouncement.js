import React, { useState } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCreateAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateAnnouncement = async () => {
    try {
      const response = await axios.post("http://localhost:8000/announcement/", {
        Title: title,
        Body: description,
      });

      if (response.status === 201) {
        console.log("Announcement Created:", response.data);
        navigate("/AdminHome"); // Navigate to the dashboard after successful creation
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("There was an error creating the announcement. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/AdminHome");
  };

  return (
    <Container
      fluid
      className="admin-create-announcement-page p-4"
      style={{ maxWidth: "600px" }}
    >
      <h2 className="admin-create-title">Create Announcement</h2>
      <hr className="admin-create-divider mb-4" />
      <Form>
        <Form.Group controlId="announcementTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="announcementDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Enter announcement description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="warning"
            className="me-3"
            onClick={() => setShowConfirmModal(true)} // Show confirmation modal on Create click
          >
            Create
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Announcement Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to create this announcement?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowConfirmModal(false); // Close modal
              handleCreateAnnouncement(); // Proceed with creation
            }}
          >
            Confirm
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

export default AdminCreateAnnouncement;
