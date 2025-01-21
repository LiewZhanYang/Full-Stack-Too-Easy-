import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Workshops = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("http://localhost:8000/program/type/1"); // Replace '1' with the TypeID for workshops
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched workshops:", data);
        setPrograms(data);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      }
    };

    fetchWorkshops();
  }, []);

  const handleEditClick = (programId) => {
    navigate(`/admin-edit-program/${programId}`);
  };

  const handleViewSessionsClick = (programId) => {
    navigate(`/admin-view-session/${programId}`);
  };

  return (
    <Container fluid className="workshops-page p-4">
      <h2 className="precoaching-title">All Workshops</h2>

      {/* Program Cards */}
      <Row className="workshops-cards-row">
        {programs.map((program) => (
          <Col
            md={4}
            key={program.ProgramID}
            className="workshops-card-col mb-4 d-flex align-items-stretch"
          >
            <Card className="workshops-card shadow-sm h-100">
              <div className="workshops-card-image-container">
                <Card.Img
                  variant="top"
                  src={program.image || "/img/default.jpg"}
                  alt={program.ProgramName}
                  className="workshops-card-image"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title
                  className="workshops-card-title"
                  style={{ textAlign: "left" }}
                >
                  {program.ProgramName}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Workshops;
