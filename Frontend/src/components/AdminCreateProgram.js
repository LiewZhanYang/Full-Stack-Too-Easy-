import React, { useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const AdminCreateProgram = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [costTiers, setCostTiers] = useState([{ id: 1, cost: "" }]);
  const [classSize, setClassSize] = useState("");
  const [duration, setDuration] = useState("");
  const [lunchProvided, setLunchProvided] = useState(false);
  const [lunchOptions, setLunchOptions] = useState([""]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleAddTier = () => {
    setCostTiers([...costTiers, { id: costTiers.length + 1, cost: "" }]);
  };

  const handleCostChange = (index, value) => {
    const updatedTiers = costTiers.map((tier, idx) =>
      idx === index ? { ...tier, cost: value } : tier
    );
    setCostTiers(updatedTiers);
  };

  const handleDeleteTier = (index) => {
    setCostTiers(costTiers.filter((_, idx) => idx !== index));
  };

  const handleLunchOptionChange = (index, value) => {
    const updatedOptions = lunchOptions.map((option, idx) =>
      idx === index ? value : option
    );
    setLunchOptions(updatedOptions);
  };

  const handleAddLunchOption = () => {
    setLunchOptions([...lunchOptions, ""]);
  };

  const handleDeleteLunchOption = (index) => {
    setLunchOptions(lunchOptions.filter((_, idx) => idx !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file object for submission
    }
  };

  const handleCreateProgram = async () => {
    try {
      // Prepare form data for submission
      const formData = new FormData();
      formData.append("ProgramName", name);
      formData.append("ProgramDesc", description);
      formData.append("Cost", costTiers.map((tier) => tier.cost).join(",")); // Assuming costs are comma-separated
      formData.append("ClassSize", classSize);
      formData.append("Duration", duration);
      formData.append("LunchProvided", lunchProvided ? 1 : 0); // Convert boolean to integer (1 for true, 0 for false)
      formData.append("TypeID", type); // This should match the TypeID or type value expected by the backend
      formData.append("LunchOptions", lunchOptions.join(",")); // Comma-separated string for multiple options

      // Append the image file if available
      if (image) {
        formData.append("file", image); // The field name "file" should match what the backend expects for file uploads
      }

      // Make the POST request to create the program
      const response = await fetch("http://localhost:8000/program", {
        method: "POST",
        body: formData, // Send FormData as the request body
      });

      if (response.ok) {
        console.log("Program created successfully!");
        navigate("/admin-view-program"); // Navigate to view programs page
      } else {
        console.error("Failed to create program");
      }
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

        <Form.Label>Cost Tiers</Form.Label>
        {costTiers.map((tier, index) => (
          <InputGroup className="mb-2" key={tier.id}>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter cost"
              value={tier.cost}
              onChange={(e) => handleCostChange(index, e.target.value)}
            />
            <Button
              variant="outline-danger"
              onClick={() => handleDeleteTier(index)}
            >
              <FaTrash />
            </Button>
          </InputGroup>
        ))}
        <Button variant="outline-secondary" onClick={handleAddTier}>
          Add Tier/Type
        </Button>

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

        {lunchProvided && (
          <div className="lunch-options">
            <Form.Label>Lunch Options</Form.Label>
            {lunchOptions.map((option, index) => (
              <InputGroup className="mb-2" key={index}>
                <Form.Control
                  type="text"
                  placeholder="Enter lunch option"
                  value={option}
                  onChange={(e) =>
                    handleLunchOptionChange(index, e.target.value)
                  }
                />
                <Button
                  variant="outline-danger"
                  onClick={() => handleDeleteLunchOption(index)}
                >
                  <FaTrash />
                </Button>
              </InputGroup>
            ))}
            <Button variant="outline-secondary" onClick={handleAddLunchOption}>
              Add Lunch Option
            </Button>
          </div>
        )}

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
