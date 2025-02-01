import React, { useState, useEffect } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditProgram = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const { id: programID } = useParams();

  // Fetch program details and tiers using ProgramID
  useEffect(() => {
    const fetchProgramAndTiers = async () => {
      try {
        console.log(`Fetching program details for ProgramID: ${programID}`);
        const programResponse = await fetch(
          `http://localhost:8000/program/${programID}`
        );

        if (!programResponse.ok) {
          throw new Error(
            `Failed to fetch program details: ${programResponse.statusText}`
          );
        }

        const programData = await programResponse.json();
        setName(programData.ProgramName);
        setType(programData.TypeID);
        setDescription(programData.ProgramDesc);
        setImagePreview(programData.imageUrl || null);

        console.log(`Fetching tiers for ProgramID: ${programID}`);
        const tierResponse = await fetch(
          `http://localhost:8000/tier/program/${programID}`
        );

        if (!tierResponse.ok) {
          throw new Error(
            `Failed to fetch tier details: ${tierResponse.statusText}`
          );
        }

        const tierData = await tierResponse.json();
        setTiers(
          tierData.map((tier) => ({
            tierID: tier.TierID || null,
            name: tier.Name || "",
            cost: tier.Cost || "",
            classSize: tier.ClassSize || "",
            duration: tier.Duration || "",
            lunchProvided: !!tier.LunchProvided,
          }))
        );
      } catch (error) {
        console.error("Error fetching program or tiers:", error);
        alert("Error fetching program or tiers. Please try again.");
      }
    };

    fetchProgramAndTiers();
  }, [programID]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[index][field] = field === "lunchProvided" ? value : value;
    setTiers(updatedTiers);
  };

  const addTier = () => {
    if (tiers.length < 3) {
      setTiers([
        ...tiers,
        {
          tierID: null,
          name: "",
          cost: "",
          classSize: "",
          duration: "",
          lunchProvided: false,
        },
      ]);
    } else {
      alert("You can only have up to 3 tiers.");
    }
  };

  const removeTier = async (index) => {
    const tierToDelete = tiers[index];
    if (tierToDelete.tierID) {
      try {
        const response = await fetch(
          `http://localhost:8000/tier/${tierToDelete.tierID}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete tier.");
        }
      } catch (error) {
        console.error("Error deleting tier:", error);
        return;
      }
    }
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleSaveProgram = async () => {
    if (
      tiers.some(
        (tier) => !tier.name || !tier.cost || !tier.classSize || !tier.duration
      )
    ) {
      alert("All tier fields must be filled.");
      return;
    }

    try {
      const programDetails = new FormData();
      programDetails.append("ProgramName", name);
      programDetails.append("ProgramDesc", description);
      programDetails.append("TypeID", type);
      if (image) programDetails.append("file", image);

      const programResponse = await fetch(
        `http://localhost:8000/program/id/${programID}`,
        {
          method: "PUT",
          body: programDetails,
        }
      );

      if (!programResponse.ok) {
        throw new Error("Failed to save program details.");
      }

      for (const tier of tiers) {
        const tierPayload = {
          Name: tier.name,
          Cost: tier.cost,
          ClassSize: tier.classSize,
          Duration: tier.duration,
          LunchProvided: tier.lunchProvided,
        };

        const tierResponse = await fetch(
          tier.tierID
            ? `http://localhost:8000/tier/${tier.tierID}`
            : `http://localhost:8000/tier/${programID}`,
          {
            method: tier.tierID ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tierPayload),
          }
        );

        if (!tierResponse.ok) {
          throw new Error(
            `Failed to ${tier.tierID ? "update" : "create"} tier.`
          );
        }
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving program or tiers:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => navigate("/admin-view-program");

  return (
    <Container fluid className="admin-create-program-page p-4">
      <h2 className="precoaching-title">Edit Program</h2>

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
                alt="Preview"
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

        <h3 className="mt-4">Cost Tiers</h3>
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="tier-section mb-4 p-3 rounded"
            style={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
            }}
          >
            <Form.Group controlId={`tierName${index}`} className="mb-3">
              <Form.Label>Tier {index + 1} Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tier name"
                value={tier.name}
                onChange={(e) =>
                  handleTierChange(index, "name", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group controlId={`tierCost${index}`} className="mb-3">
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
            <Form.Group controlId={`tierClassSize${index}`} className="mb-3">
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
            <Form.Group controlId={`tierDuration${index}`} className="mb-3">
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter duration"
                value={tier.duration}
                onChange={(e) =>
                  handleTierChange(index, "duration", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group
              controlId={`tierLunchProvided${index}`}
              className="mb-3"
            >
              <Form.Check
                type="checkbox"
                label="Lunch Provided"
                checked={tier.lunchProvided}
                onChange={(e) =>
                  handleTierChange(index, "lunchProvided", e.target.checked)
                }
              />
            </Form.Group>
            <Button
              variant="danger"
              className="mt-2"
              onClick={() => removeTier(index)}
            >
              Remove Tier
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={addTier}>
          Add Tier
        </Button>
        <div className="admin-create-button-group mt-4">
          <Button
            variant="warning"
            style={{
              backgroundColor: "#fbbf24",
              color: "black",
            }}
            className="admin-create-confirm-button me-3"
            onClick={() => setShowConfirmModal(true)}
          >
            Save
          </Button>
          <Button
            variant="danger"
            style={{
              backgroundColor: "#dc3545",
              color: "white",
            }}
            className="admin-create-cancel-button"
            onClick={handleCancel}
          >
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

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Changes Saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>The changes have been saved successfully.</Modal.Body>
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
