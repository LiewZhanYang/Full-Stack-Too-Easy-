import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const SubmitMc = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, program, tier } = location.state || {}; // Current session details

  console.log("Received state:", location.state);

  const [customerName, setCustomerName] = useState("Loading...");
  const [file, setFile] = useState(null);
  const [reason, setReason] = useState(""); // Required field for backend
  const [availableSessions, setAvailableSessions] = useState([]); // Available sessions excluding the current one
  const [selectedSession, setSelectedSession] = useState(""); // Stores the new session for transfer
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCustomerName = async () => {
      if (!userId) {
        console.warn("User ID is missing. Skipping customer fetch.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/customer/id/${userId}`
        );
        if (response.data.length > 0) {
          setCustomerName(response.data[0].Name || "User");
        }
      } catch (error) {
        console.error("Error fetching customer name:", error);
        setCustomerName("Unknown User");
      }
    };

    const fetchAvailableSessions = async () => {
      if (!tier?.TierID) {
        console.warn("No TierID provided, skipping session fetch.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/session/${tier.TierID}`
        );

        const filteredSessions = response.data.filter(
          (s) => s.SessionID !== session?.SessionID
        );

        setAvailableSessions(filteredSessions);
      } catch (error) {
        console.error("Error fetching sessions by TierID:", error);
      }
    };

    fetchCustomerName();
    fetchAvailableSessions();
  }, [userId, session?.SessionID, tier?.TierID]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedSession) {
      alert("Please select a session.");
      return;
    }
    if (!reason) {
      alert("Please provide a reason.");
      return;
    }
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("signUpID", session?.SessionID); // Using session ID as signUpID
      formData.append("newSessionID", selectedSession); // Selected session for transfer
      formData.append("reason", reason); // Required by backend
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8000/submit-mc-transfer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Medical certificate submitted. Transfer request sent.");
        navigate(-1);
      } else {
        alert("Failed to submit medical certificate.");
      }
    } catch (error) {
      console.error("Error submitting medical certificate:", error);
      alert("An error occurred while submitting the medical certificate.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container fluid className="submit-mc-page p-4">
      <h2 className="precoaching-title">
        Submit Medical Certificate & Request Transfer
      </h2>

      <Form.Group controlId="customerName" className="mb-3">
        <Form.Label>
          <strong>Customer Name</strong>
        </Form.Label>
        <p>{customerName}</p>
      </Form.Group>

      <Form.Group controlId="currentSession" className="mb-3">
        <Form.Label>
          <strong>Current Session Details</strong>
        </Form.Label>
        <p>
          {session ? (
            <>
              <strong>Date:</strong>{" "}
              {new Date(session.StartDate).toLocaleDateString()} <br />
              <strong>Time:</strong> {session.Time} <br />
              <strong>Location:</strong> {session.Location}
            </>
          ) : (
            "No session data available"
          )}
        </p>
      </Form.Group>

      <Form.Group controlId="selectSession" className="mb-3">
        <Form.Label>Select New Session</Form.Label>
        <Form.Control
          as="select"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">Select a new session</option>
          {availableSessions.length > 0 ? (
            availableSessions.map((s) => (
              <option key={s.SessionID} value={s.SessionID}>
                {new Date(s.StartDate).toLocaleDateString()} - {s.Time} -{" "}
                {s.Location}
              </option>
            ))
          ) : (
            <option disabled>No sessions available</option>
          )}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="reason" className="mb-3">
        <Form.Label>Reason for Transfer</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason for the session transfer"
        />
      </Form.Group>

      <Form.Group controlId="uploadFile" className="mb-3">
        <Form.Label>Upload Medical Certificate</Form.Label>
        <Form.Control
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
        {file && (
          <div className="mt-3">
            <p className="small text-muted mb-1">{file.name}</p>
            <Button
              variant="link"
              className="text-danger p-0"
              onClick={() => setFile(null)}
            >
              Remove
            </Button>
          </div>
        )}
      </Form.Group>

      <div className="submit-mc-button-group mt-4">
        <Button variant="warning" className="me-3" onClick={handleSubmit}>
          Submit & Request Transfer
        </Button>
        <Button variant="danger" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default SubmitMc;
