import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminCreateProgram = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [classSize, setClassSize] = useState("");
  const [duration, setDuration] = useState("");
  const [lunchProvided, setLunchProvided] = useState(false);
  const navigate = useNavigate();

  // Mapping of program types to their IDs
  const programTypeMapping = {
    Workshop: 1,
    Camp: 2,
    Lab: 3,
    Professional: 4,
  };

  const handleCreateProgram = async () => {
    // Convert the selected type to its corresponding ID
    const typeId = programTypeMapping[type] || null;

    const programData = {
      ProgramName: name,
      ProgramDesc: description,
      Cost: cost,
      ClassSize: classSize,
      Duration: duration,
      LunchProvided: lunchProvided,
      TypeID: typeId,
    };

    try {
      const response = await fetch("http://localhost:8000/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      console.log("Program created successfully");
      navigate("/admin-programs");
    } catch (error) {
      console.error("Error creating program:", error);
    }
  };

  const handleCancel = () => {
    navigate('/admin-view-program');
  };

  return (
    <Container fluid className="admin-create-program-page p-4">
      <h2 className="admin-create-title">Create Program</h2>
      <hr className="admin-create-divider mb-4" />

      <Form>
        <Form.Group controlId="programName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter program name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="programType" className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Workshop">Workshop</option>
            <option value="Camp">Camp</option>
            <option value="Lab">Lab</option>
            <option value="Professional">Professional</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="programDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter program description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="programCost" className="mb-3">
          <Form.Label>Cost</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="programClassSize" className="mt-3 mb-3">
          <Form.Label>Class Size</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter class size"
            value={classSize}
            onChange={(e) => setClassSize(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="programDuration" className="mb-3">
          <Form.Label>Duration (in hours)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="lunchProvided" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Lunch Provided"
            checked={lunchProvided}
            onChange={(e) => setLunchProvided(e.target.checked)}
          />
        </Form.Group>

        <div className="admin-create-button-group mt-4">
          <Button
            variant="warning"
            className="admin-create-confirm-button me-3"
            onClick={handleCreateProgram}
          >
            Create Program
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
    </Container>
  );
};

export default AdminCreateProgram;
