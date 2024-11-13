import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const WebinarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [webinar, setWebinar] = useState(null);

  useEffect(() => {
    const fetchWebinarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/webinar/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setWebinar(data[0]); // Assuming data returns an array with one object
      } catch (error) {
        console.error("Error fetching webinar details:", error);
      }
    };

    fetchWebinarDetails();
  }, [id]);

  if (!webinar) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5">
      <h2 className="precoaching-title" style={{ textAlign: "left" }}>
        {webinar.WebinarName}
      </h2>
      <hr style={{ borderTop: "1px solid #ccc", marginBottom: "1rem" }} />

      <Card
        className="shadow-sm p-4 mb-4 bg-light rounded border-0"
        style={{ textAlign: "left" }}
      >
        <Row className="mb-3">
          <Col xs={12}>
            <p className="admin-program-card-title">Description</p>
            <p>{webinar.WebinarDesc}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <p className="admin-program-card-title">Link</p>
            <p className="text-primary" style={{ margin: 0 }}>
              {webinar.Link}
            </p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={3}>
            <p className="admin-program-card-title">Date</p>
            <p>{new Date(webinar.Date).toLocaleDateString()}</p>
          </Col>
          <Col xs={3}>
            <p className="admin-program-card-title">Starts</p>
            <p>
              {new Date(`1970-01-01T${webinar.StartTime}`).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}
            </p>
          </Col>
          <Col xs={3}>
            <p className="admin-program-card-title">End</p>
            <p>
              {new Date(`1970-01-01T${webinar.EndTime}`).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}
            </p>
          </Col>
          <Col xs={3}>
            <p className="admin-program-card-title">Speaker</p>
            <p>{webinar.Speaker}</p>
          </Col>
        </Row>

        <div className="d-flex justify-content-start mt-3">
          <Button
            variant="warning"
            className="me-3 px-4"
            style={{ fontWeight: "bold" }}
          >
            Join
          </Button>
          <Button
            variant="outline-secondary"
            className="px-4"
            style={{ fontWeight: "bold" }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default WebinarDetails;
