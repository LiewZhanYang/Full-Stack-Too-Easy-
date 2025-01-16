import React, { useState, useEffect } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap"; // Added Modal import
import { useNavigate, useParams } from "react-router-dom";

const AdminEditProgram = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch program details from backend on component load
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
        setImagePreview(data.imageUrl || null);
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };
    fetchProgramDetails();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProgram = async () => {
    try {
      const formData = new FormData();
      formData.append("ProgramName", name);
      formData.append("ProgramDesc", description);
      formData.append("TypeID", type);
      if (image) {
        formData.append("file", image);
      }

      const response = await fetch(`http://localhost:8000/program/id/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save program");
      }
      setShowConfirmModal(false); // Close confirm modal on success
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      console.error("Error saving program:", error);
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(true); // Open confirmation modal
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
          {imagePreview && (
            <div className="image-preview mt-3">
              <img
                src={imagePreview}
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

        <div className="admin-create-button-group mt-4">
          <Button
            variant="warning"
            className="admin-create-confirm-button me-3"
            onClick={handleConfirmSave}
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
