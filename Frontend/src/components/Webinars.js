import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await fetch("http://localhost:8000/webinar");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched webinars:", data);
        setWebinars(data); 
      } catch (error) {
        console.error("Error fetching webinars:", error);
      }
    };

    fetchWebinars();
  }, []);

  const handleViewDetailsClick = (webinarId) => {
    navigate(`/webinar-details/${webinarId}`);
  };

  return (
    <Container fluid className="admin-program-page mt-5 p-4">
      <h2 className="precoaching-title">Webinars</h2>
      <hr style={{ borderTop: "1px solid #ccc", marginBottom: "1rem" }} />

      <Row className="admin-program-cards-row">
        {webinars.map((webinar) => (
          <Col
            md={4}
            key={webinar.WebinarID}
            className="admin-program-card-col mb-4 d-flex align-items-stretch"
          >
            <Card className="admin-program-card shadow-sm h-100">
              <div className="admin-program-card-image-container">
                <Card.Img
                  variant="top"
                  src={webinar.image || "/img/default.jpg"}
                  alt={webinar.WebinarName}
                  className="admin-program-card-image"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title
                  className="admin-program-card-title"
                  style={{ textAlign: "left" }}
                >
                  {webinar.WebinarName}
                </Card.Title>
                <Card.Text style={{ textAlign: "left" }}>
                  Date: {new Date(webinar.Date).toLocaleDateString()}
                </Card.Text>
                <Card.Text style={{ textAlign: "left" }}>
                  Speaker: {webinar.Speaker}
                </Card.Text>
                <div className="d-flex gap-2 mt-auto">
                  <Button
                    variant="warning"
                    className="admin-program-view-details-button d-flex align-items-center"
                    onClick={() => handleViewDetailsClick(webinar.WebinarID)}
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
