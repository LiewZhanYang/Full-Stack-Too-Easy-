import React, { useState } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminCreateProgram = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [tiers, setTiers] = useState([
    {
      tierName: "",
      cost: "",
      classSize: "",
      lunchProvided: false,
      duration: "",
    },
  ]);

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
      setImage(file);
    }
  };

  const handleAddTier = () => {
    if (tiers.length < 3) {
      setTiers([
        ...tiers,
        {
          tierName: "",
          cost: "",
          classSize: "",
          lunchProvided: false,
          duration: "",
        },
      ]);
    }
  };

  const handleRemoveTier = (index) => {
    const newTiers = tiers.filter((_, idx) => idx !== index);
    setTiers(newTiers);
  };

  const handleTierChange = (index, field, value) => {
    const updatedTiers = tiers.map((tier, idx) =>
      idx === index ? { ...tier, [field]: value } : tier
    );
    setTiers(updatedTiers);
  };

  const handleCreateProgram = async () => {
    const typeId = programTypeMapping[type] || null;

    const formData = new FormData();
    formData.append("ProgramName", name);
    formData.append("ProgramDesc", description);
    formData.append("TypeID", typeId);
    if (image) formData.append("file", image);
    formData.append("tiers", JSON.stringify(tiers));

    try {
      const response = await fetch("http://localhost:8000/program", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
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

        <h3 className="mt-4 fs-5">Cost Tiers</h3>
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="tier-section mb-4 p-3 rounded"
            style={{
              backgroundColor: "#f9f9f9", 
              border: "1px solid #ddd",
            }}
          >
            <h5 className="mb-3">Tier {index + 1}:</h5>{" "}
            {/* Bold tier heading */}
            <Form.Group controlId={`tierName-${index}`} className="mb-3">
              <Form.Label>Tier Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tier name"
                value={tier.tierName}
                onChange={(e) =>
                  handleTierChange(index, "tierName", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group controlId={`cost-${index}`} className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter cost"
                value={tier.cost}
                onChange={(e) =>
                  handleTierChange(index, "cost", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group controlId={`classSize-${index}`} className="mb-3">
              <Form.Label>Class Size</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter class size"
                value={tier.classSize}
                onChange={(e) =>
                  handleTierChange(index, "classSize", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group controlId={`duration-${index}`} className="mb-3">
              <Form.Label>Duration (in days)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter duration"
                value={tier.duration}
                onChange={(e) =>
                  handleTierChange(index, "duration", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group controlId={`lunchProvided-${index}`} className="mb-3">
              <Form.Check
                type="checkbox"
                label="Lunch Provided"
                checked={tier.lunchProvided}
                onChange={(e) =>
                  handleTierChange(index, "lunchProvided", e.target.checked)
                }
              />
            </Form.Group>
            {tiers.length > 1 && (
              <Button
                variant="danger"
                className="mb-3"
                onClick={() => handleRemoveTier(index)}
              >
                Remove Tier
              </Button>
            )}
            <hr />
          </div>
        ))}

        {tiers.length < 3 && (
          <Button variant="secondary" onClick={handleAddTier}>
            Add Tier
          </Button>
        )}

        <div className="admin-create-button-group mt-4">
          <Button
            variant="warning"
            className="me-3"
            onClick={() => setShowConfirmModal(true)}
          >
            Create
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>

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
