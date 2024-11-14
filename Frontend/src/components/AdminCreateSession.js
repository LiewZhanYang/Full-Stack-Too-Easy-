import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminCreateSession = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [vacancy, setVacancy] = useState("");
  const navigate = useNavigate();
  const { id: programID } = useParams();

  const handleCreateSession = async () => {
    const sessionDetails = {
      StartDate: startDate,
      EndDate: endDate,
      Time: time,
      Location: location,
      Vacancy: vacancy,
      ProgramID: programID,
    };

    try {
      const response = await fetch("http://localhost:8000/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      console.log("Session Created:", sessionDetails);
      navigate(`/admin-programs/${programID}/sessions`);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin-view-program");
  };

  return (
    <Container fluid className="admin-create-session-page p-4">
      <h2 className="page-title">Public Speaking Workshop - Create Session</h2>
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
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            placeholder="Enter time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="location" className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="vacancy" className="mb-4">
          <Form.Label>Vacancy</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter vacancy"
            value={vacancy}
            onChange={(e) => setVacancy(e.target.value)}
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
