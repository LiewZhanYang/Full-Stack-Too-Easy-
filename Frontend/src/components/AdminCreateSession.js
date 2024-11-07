import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminCreateSession = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleCreateSession = () => {
    // Add logic to handle session creation
    console.log("Session Created:", { startDate, endDate, time, location });
  };

  const handleCancel = () => {
    navigate("/admin-programs");
  };

  return (
    <Container fluid className="admin-edit-session-page p-4">
      <h2 className="page-title">Public Speaking Workshop - Edit Session</h2>
      <hr className="divider-line mb-4" />

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="startDate" className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="endDate" className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="time" className="mb-3">
          <Form.Label>Time (24 HRS)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., 10:00-18:00"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="location" className="mb-4">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <div className="button-group">
          <Button
            variant="warning"
            className="create-session-button"
            onClick={handleCreateSession}
          >
            Create
          </Button>
          <Button
            variant="danger"
            className="cancel-button ms-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminCreateSession;
