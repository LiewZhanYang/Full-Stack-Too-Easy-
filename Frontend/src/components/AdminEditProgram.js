import React, { useState, useEffect } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditProgram = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [classSize, setClassSize] = useState("");
  const [duration, setDuration] = useState("");
  const [lunchProvided, setLunchProvided] = useState(false);
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/program/${id}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch program details: ${response.statusText}`
          );
        }
        const data = await response.json();
        setName(data.ProgrameName);
        setType(data.TypeID);
        setDescription(data.ProgramDesc);
        setCost(data.Cost);
        setClassSize(data.ClassSize);
        setDuration(data.Duration);
        setLunchProvided(data.LunchProvided);
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };

    fetchProgramDetails();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProgram = async () => {
    const formData = new FormData();
    formData.append("ProgramName", name);
    formData.append("ProgramDesc", description);
    formData.append("Cost", cost);
    formData.append("ClassSize", classSize);
    formData.append("Duration", duration);
    formData.append("LunchProvided", lunchProvided);
    formData.append("TypeID", type);
    if (image) {
      formData.append("file", image); // Attach the selected image file
    }
    formData.append("ProgramID", id); // Include ProgramID for backend reference

    try {
      const response = await fetch(`http://localhost:8000/program/id/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save program");
      }

      console.log("Program saved successfully");
      setShowConfirmModal(false); // Close the confirmation modal
      setShowSuccessModal(true); // Open the success modal
    } catch (error) {
      console.error("Error saving program:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin-view-program");
  };

  return (
    <Container fluid className="admin-create-program-page p-4">
      <h2 className="admin-create-title">Edit Program</h2>
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

        <Form.Group controlId="programImage" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <div className="image-preview mt-3">
              <img
                src={image}
                alt="Program Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="programType" className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="1">Workshop</option>
            <option value="2">Camp</option>
            <option value="3">Lab</option>
            <option value="4">Professional</option>
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

        <Form.Group controlId="programClassSize" className="mb-3">
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
            onClick={() => setShowConfirmModal(true)} // Show confirmation modal on click
          >
            Save
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
          <Modal.Title>Confirm Save</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save these changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveProgram}>
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
          <Modal.Title>Program Saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>The program has been saved successfully.</Modal.Body>
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

export default AdminEditProgram;
