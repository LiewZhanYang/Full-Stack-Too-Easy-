import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmitMc = () => {
  const [name, setName] = useState("");
  const [children, setChildren] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:8000/children/${userId}`
        );
        setChildren(response.data);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/sessions");
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchChildren();
    fetchSessions();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!name || !selectedChild || !selectedSession || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("childId", selectedChild);
      formData.append("sessionId", selectedSession);
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8000/submit-mc",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Medical certificate submitted successfully.");
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
      <h2 className="precoaching-title">Submit Medical Certificate</h2>
      needs name, child, session to change to, file, program, current session
      maybe can add function to switch to another child to attend
      <Form>
        <Form.Group controlId="mcName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="selectChild" className="mb-3">
          <Form.Label>Select Child</Form.Label>
          <Form.Control
            as="select"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="">Select a child</option>
            {children.map((child) => (
              <option key={child.ChildID} value={child.ChildID}>
                {child.Name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="selectSession" className="mb-3">
          <Form.Label>Select Session</Form.Label>
          <Form.Control
            as="select"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">Select a session to change to</option>
            {sessions.map((session) => (
              <option key={session.SessionID} value={session.SessionID}>
                {session.Name} (
                {new Date(session.StartDate).toLocaleDateString()} -{" "}
                {new Date(session.EndDate).toLocaleDateString()})
              </option>
            ))}
          </Form.Control>
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
            Submit
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SubmitMc;
