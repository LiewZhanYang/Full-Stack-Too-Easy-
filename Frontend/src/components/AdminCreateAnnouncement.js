import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCreateAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateAnnouncement = async () => {
    try {
      const response = await axios.post("http://localhost:8000/announcement/", {
        Title: title,
        Body: description,
      });

      if (response.status === 201) {
        console.log("Announcement Created:", response.data);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container fluid className="admin-create-announcement-page p-4">
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

        <div className="admin-create-button-group mt-4">
          <Button
            variant="warning"
            className="admin-create-confirm-button me-3"
            onClick={() => setShowConfirmModal(true)} // Show confirmation modal
          >
            Create
          </Button>
          <Button
            variant="danger"
            className="admin-create-cancel-button"
            onClick={handleCancel}
          >
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
          <Button variant="primary" onClick={handleCreateAnnouncement}>
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

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Announcement Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>The announcement has been created successfully.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate(-1);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCreateAnnouncement;
