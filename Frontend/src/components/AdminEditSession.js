import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AdminEditSession = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false); // State for save confirmation modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success confirmation modal
  const navigate = useNavigate();
  const { id: sessionID } = useParams();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/session/sessionID/${sessionID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch session details");
        }
        const session = await response.json();

        if (session) {
          setStartDate(formatDate(session.StartDate));
          setEndDate(formatDate(session.EndDate));
          setTime(session.Time);
          setLocation(session.Location);
          setVacancy(session.Vacancy);
        } else {
          console.error("Session not found");
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    fetchSessionDetails();
  }, [sessionID]);

  const handleSaveSession = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/session/${sessionID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            StartDate: startDate,
            EndDate: endDate,
            Time: time,
            Location: location,
            Vacancy: vacancy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save session");
      }

      console.log("Session saved successfully");
      setShowSaveModal(false); // Close the save confirmation modal
      setShowSuccessModal(true); // Open the success confirmation modal
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
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="endDate" className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="time" className="mb-3">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., 10:00-18:00"
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
            className="save-button"
            onClick={() => setShowSaveModal(true)} // Open modal on Save click
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

      {/* Save Confirmation Modal */}
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Save Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to save the changes to this session?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveSession}>
            Confirm Save
          </Button>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Confirmation Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Session Saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>The session has been successfully saved.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/admin-view-program");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminEditSession;
