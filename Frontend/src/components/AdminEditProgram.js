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
  const { id } = useParams();

  useEffect(() => {
    const fetchProgramAndTiers = async () => {
      try {
        console.log(`Fetching program details for ProgramID: ${id}`);
        const programResponse = await fetch(
          `http://localhost:8000/program/${id}`
        );

        if (!programResponse.ok) {
          console.error(
            `Failed to fetch program details: ${programResponse.statusText}`
          );
          throw new Error("Failed to fetch program details.");
        }

        const programData = await programResponse.json();
        console.log("Program data fetched:", programData);
        setName(programData.ProgramName);
        setType(programData.TypeID);
        setDescription(programData.ProgramDesc);
        setImagePreview(programData.imageUrl || null);

        console.log(`Fetching tiers for ProgramID: ${id}`);
        const tierResponse = await fetch(`http://localhost:8000/tier/${id}`);

        if (!tierResponse.ok) {
          console.error(
            `Failed to fetch tier details: ${tierResponse.statusText}`
          );
          throw new Error("Failed to fetch tier details.");
        }

        const tierData = await tierResponse.json();
        console.log("Tier data fetched:", tierData);

        setTiers(
          tierData.map((tier) => ({
            tierID: tier.TierID || null,
            name: tier.Name || "",
            cost: tier.Cost || "",
            classSize: tier.ClassSize || "",
            duration: tier.Duration || "",
            lunchProvided: tier.LunchProvided || false,
          }))
        );
      } catch (error) {
        console.error("Error fetching program or tiers:", error);
        alert("Error fetching program or tiers. Please try again.");
      }
    };

    fetchProgramAndTiers();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTierChange = (index, field, value) => {
    console.log(
      `Updating Tier at index ${index}, field: ${field}, value: ${value}`
    );
    const updatedTiers = [...tiers];
    updatedTiers[index][field] =
      field === "lunchProvided" ? value.target.checked : value;
    setTiers(updatedTiers);
    console.log("Updated tiers:", updatedTiers);
  };

  const addTier = () => {
    if (tiers.length < 3) {
      console.log("Adding new tier");
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
    console.log(`Removing tier at index ${index}`, tierToDelete);

    if (tierToDelete.tierID) {
      try {
        const response = await fetch(
          `http://localhost:8000/tier/${tierToDelete.tierID}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          console.error("Failed to delete tier from backend.");
          throw new Error("Failed to delete tier.");
        }

        console.log("Tier deleted successfully.");
      } catch (error) {
        console.error("Error deleting tier:", error);
        return;
      }
    }

    setTiers(tiers.filter((_, i) => i !== index));
    console.log("Tier removed. Remaining tiers:", tiers);
  };

  const handleSaveProgram = async () => {
    console.log("Saving program and tiers...");

    if (
      tiers.some(
        (tier) => !tier.name || !tier.cost || !tier.classSize || !tier.duration
      )
    ) {
      alert("All tier fields must be filled.");
      return;
    }

    try {
      console.log("Updating program details...");
      const programDetails = new FormData();
      programDetails.append("ProgramName", name);
      programDetails.append("ProgramDesc", description);
      programDetails.append("TypeID", type);
      if (image) programDetails.append("file", image);

      // Update program details
      const programResponse = await fetch(
        `http://localhost:8000/program/id/${id}`,
        {
          method: "PUT",
          body: programDetails,
        }
      );

      if (!programResponse.ok) {
        console.error(
          "Failed to save program details:",
          await programResponse.text()
        );
        throw new Error("Failed to save program details.");
      }

      console.log("Program details saved successfully.");

      // Update tiers
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
            : `http://localhost:8000/tier/${id}`,
          {
            method: tier.tierID ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tierPayload),
          }
        );

        if (!tierResponse.ok) {
          console.error(
            `Failed to ${tier.tierID ? "update" : "create"} tier:`,
            tier.name,
            "Response:",
            await tierResponse.text()
          );
          throw new Error(`Failed to save tier: ${tier.name}`);
        }

        console.log(`Tier ${tier.name} saved successfully.`);
      }

      console.log("All tiers saved successfully.");
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving program or tiers:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    console.log("Navigating back to program list.");
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
            className="admin-create-confirm-button me-3"
            onClick={() => setShowConfirmModal(true)} // Show confirmation modal
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
