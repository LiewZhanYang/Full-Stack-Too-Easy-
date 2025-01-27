import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminViewProgramDetails = () => {
  const [programDetails, setProgramDetails] = useState({});
  const [tiers, setTiers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Type mapping for TypeID
  const typeMapping = {
    1: "Workshops",
    2: "Camps",
    3: "Labs",
    4: "Professional",
  };

  useEffect(() => {
    const fetchProgramAndTiers = async () => {
      try {
        const programResponse = await fetch(
          `http://localhost:8000/program/${id}`
        );
        if (!programResponse.ok) {
          throw new Error("Failed to fetch program details.");
        }
        const programData = await programResponse.json();
        setProgramDetails(programData);

        const tierResponse = await fetch(`http://localhost:8000/tier/${id}`);
        if (!tierResponse.ok) {
          throw new Error("Failed to fetch tier details.");
        }
        const tierData = await tierResponse.json();
        setTiers(tierData);
      } catch (error) {
        console.error("Error fetching program or tiers:", error);
        alert("Failed to fetch program details. Please try again.");
      }
    };

    fetchProgramAndTiers();
  }, [id]);

  return (
    <Container fluid className="admin-view-program-page p-4">
      <h2 className="admin-create-title">View Program Details</h2>
      <hr className="admin-create-divider mb-4" />

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="programName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={programDetails.ProgramName || ""}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="programType" className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={typeMapping[programDetails.TypeID] || "Unknown"}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="programDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={programDetails.ProgramDesc || ""}
            disabled
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
              <Form.Control type="text" value={tier.Name || ""} disabled />
            </Form.Group>
            <Form.Group controlId={`tierCost${index}`} className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control type="text" value={tier.Cost || ""} disabled />
            </Form.Group>
            <Form.Group controlId={`tierClassSize${index}`} className="mb-3">
              <Form.Label>Class Size</Form.Label>
              <Form.Control
                type="number"
                value={tier.ClassSize || ""}
                disabled
              />
            </Form.Group>
            <Form.Group controlId={`tierDuration${index}`} className="mb-3">
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control
                type="number"
                value={tier.Duration || ""}
                disabled
              />
            </Form.Group>
            <Form.Group
              controlId={`tierLunchProvided${index}`}
              className="mb-3"
            >
              <Form.Check
                type="checkbox"
                label="Lunch Provided"
                checked={tier.LunchProvided || false}
                disabled
              />
            </Form.Group>
          </div>
        ))}

        <div className="admin-view-button-group mt-4">
          <Button
            variant="warning"
            onClick={() => navigate(`/admin-edit-program/${id}`)}
          >
            Edit Program
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminViewProgramDetails;
