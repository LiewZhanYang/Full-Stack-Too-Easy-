import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Webinars = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:8000/program");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched programs:", data);

        const webinars = data.filter((program) => program.TypeID === 5);
        setPrograms(webinars);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  const handleViewDetailsClick = (programId) => {
    navigate(`/admin-view-program/${programId}`);
  };

  return (
    <Container fluid className="admin-program-page mt-5 p-4">
      <h2 className="precoaching-title">Webinars</h2>
      <hr style={{ borderTop: "1px solid #ccc", marginBottom: "1rem" }} />

      <Row className="admin-program-cards-row">
        {programs.map((program) => (
          <Col
            md={4}
            key={program.ProgramID}
            className="admin-program-card-col mb-4 d-flex align-items-stretch"
          >
            <Card className="admin-program-card shadow-sm h-100">
              <div className="admin-program-card-image-container">
                <Card.Img
                  variant="top"
                  src={program.image || "/img/default.jpg"}
                  alt={program.ProgrameName}
                  className="admin-program-card-image"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title
                  className="admin-program-card-title"
                  style={{ textAlign: "left" }}
                >
                  {program.ProgrameName}
                </Card.Title>
                <Card.Text style={{ textAlign: "left" }}>
                </Card.Text>
                <div className="d-flex gap-2 mt-auto">
                  <Button
                    variant="warning"
                    className="admin-program-view-details-button d-flex align-items-center"
                    onClick={() => handleViewDetailsClick(program.ProgramID)}
                  >
                    <FaInfoCircle className="me-1" /> <span>View Details</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Webinars;
