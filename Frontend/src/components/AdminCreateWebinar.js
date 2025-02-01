import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCreateWebinar = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleCreateWebinar = async () => {
    const formData = new FormData();
    formData.append("WebinarName", name);
    formData.append("WebinarDesc", description);
    formData.append("Link", link);
    formData.append("Date", date);
    formData.append("StartTime", startTime);
    formData.append("EndTime", endTime);
    formData.append("Speaker", speaker);

    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/webinar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("Webinar created:", response.data);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        console.error("Failed to create webinar");
      }
    } catch (error) {
      console.error("Error creating webinar:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Container fluid className="admin-create-webinar-page p-4">
      <h2 className="precoaching-title">Create Webinar</h2>

      <Form>
        <Form.Group controlId="webinarName" className="mb-3">
          <Form.Label>Webinar Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter webinar name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="webinarImage" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <div className="image-preview mt-3">
              <img
                src={URL.createObjectURL(image)}
                alt="Webinar Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="webinarDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter webinar description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="webinarLink" className="mb-3">
          <Form.Label>Webinar Link</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter webinar link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="webinarDate" className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="webinarStartTime" className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="webinarEndTime" className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="webinarSpeaker" className="mb-3">
          <Form.Label>Speaker</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter speaker's name"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
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
          <Modal.Title>Confirm Webinar Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to create this webinar?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateWebinar}>
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
          <Modal.Title>Webinar Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>The webinar has been created successfully.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate(-1); // Go back to the previous page
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCreateWebinar;
