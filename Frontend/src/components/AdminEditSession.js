import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditSession = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Session ID from the route params

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/session/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session details");
        }
        const data = await response.json();

        // If data is an array, find the session with the matching ID
        const session = Array.isArray(data)
          ? data.find((item) => item.SessionID === parseInt(id))
          : data;

        if (session) {
          // Log the specific session object
          console.log("Fetched session details:", session);

          // Populate form fields with fetched data
          setStartDate(session.StartDate);
          setEndDate(session.EndDate);
          setTime(session.Time);
          setLocation(session.Location);
        } else {
          console.error("Session not found");
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    fetchSessionDetails();
  }, [id]);

  const handleSaveSession = async () => {
    try {
      const response = await fetch(`http://localhost:8000/session/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          StartDate: startDate,
          EndDate: endDate,
          Time: time,
          Location: location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save session");
      }

      console.log("Session saved successfully");
      navigate("/admin-programs");
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin-view-program");
  };

  return (
    <Container fluid className="admin-edit-session-page p-4">
      <h2 className="page-title">Edit Session</h2>
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
            className="save-button"
            onClick={handleSaveSession}
          >
            Save
          </Button>
          <Button
            variant="secondary"
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

export default AdminEditSession;
