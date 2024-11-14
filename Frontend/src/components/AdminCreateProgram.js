import React, { useState } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminCreateProgram = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [classSize, setClassSize] = useState("");
  const [duration, setDuration] = useState("");
  const [lunchProvided, setLunchProvided] = useState(false);

  const [image, setImage] = useState(null); // Store image file
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const programTypeMapping = {
    Workshop: 1,
    Camp: 2,
    Lab: 3,
    Professional: 4,
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file object instead of a URL
    }
  };

  const handleCreateProgram = async () => {
    const typeId = programTypeMapping[type] || null;


    // Create FormData object
    const formData = new FormData();
    formData.append("ProgramName", name);
    formData.append("ProgramDesc", description);
    formData.append("Cost", cost);
    formData.append("ClassSize", classSize);
    formData.append("Duration", duration);
    formData.append("LunchProvided", lunchProvided ? 1 : 0); // Convert boolean to integer
    formData.append("TypeID", typeId);

    // Append the image file if available
    if (image) {
      formData.append("file", image); // Ensure field name matches backend expectation
    }

    try {
      const response = await fetch("http://localhost:8000/program", {
        method: "POST",

        body: formData, // Use FormData as the request body
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      console.log("Program created successfully");
      setShowConfirmModal(false); // Close the confirmation modal
      setShowSuccessModal(true); // Open the success modal
    } catch (error) {
      console.error("Error creating program:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin-view-program");
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

                src={URL.createObjectURL(image)}
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
          <Modal.Title>Confirm Program Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to create this program?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateProgram}>
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
          <Modal.Title>Program Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>The program has been created successfully.</Modal.Body>
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

export default AdminCreateProgram;
