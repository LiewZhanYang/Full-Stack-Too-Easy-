import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminCreateSession = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [programID, setProgramID] = useState(null); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const { id: tierID } = useParams();


  const handleCreateSession = async () => {
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Time:", time);
    console.log("Location:", location);
    console.log("Vacancy:", vacancy);
    console.log("TierID:", tierID);
  
    try {
      // 🔹 Fetch ProgramID before submitting
      console.log("Fetching ProgramID for TierID:", tierID);
      const response = await fetch(`http://localhost:8000/program/tier/${tierID}`);
      const data = await response.json();
  
      console.log("Full API Response:", data); // 🔥 Debugging log
  
      if (!response.ok || !data.ProgramIDs || data.ProgramIDs.length === 0) {
        console.error("Error fetching ProgramID:", data.error || "No ProgramID found.");
        alert("Error fetching ProgramID. Please try again.");
        return;
      }
  
      const fetchedProgramID = data.ProgramIDs[0]; // ✅ Extract first value from array
      console.log("Fetched ProgramID:", fetchedProgramID); // 🔥 Debugging log
  
      // 🔹 Validate all inputs including fetched ProgramID
      if (!startDate || !endDate || !time || !location || !vacancy || !tierID || !fetchedProgramID) {
        alert("Please fill in all fields before submitting.");
        return;
      }
  
      // 🔹 Prepare session details
      const sessionDetails = {
        StartDate: startDate,
        EndDate: endDate,
        Time: time,
        Location: location,
        Vacancy: parseInt(vacancy, 10),
        TierID: parseInt(tierID, 10),
        ProgramID: parseInt(fetchedProgramID, 10),
      };
  
      console.log("Sending session details:", sessionDetails);
  
      // 🔹 Submit session to the backend
      const createResponse = await fetch("http://localhost:8000/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionDetails),
      });
  
      const createData = await createResponse.json();
      console.log("Response from server:", createData);
  
      if (!createResponse.ok) {
        throw new Error(createData.error || "Failed to create session");
      }
  
      alert("Session created successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Check console for details.");
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
            onClick={() => setShowConfirmModal(true)} // Show confirmation modal
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

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Session Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to create this session?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateSession}>
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
          <Modal.Title>Session Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>The session has been created successfully.</Modal.Body>
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

export default AdminCreateSession;
