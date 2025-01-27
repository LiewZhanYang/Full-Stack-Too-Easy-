import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdminViewWebinarDetails = () => {
  const [webinarDetails, setWebinarDetails] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchWebinarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/webinar/${id}`);
        const data = response.data[0];
        setWebinarDetails(data);
      } catch (error) {
        console.error("Error fetching webinar details:", error);
        alert("Failed to fetch webinar details. Please try again.");
      }
    };

    fetchWebinarDetails();
  }, [id]);

  return (
    <Container fluid className="admin-view-webinar-page p-4">
      <h2 className="admin-create-title">View Webinar Details</h2>
      <hr className="admin-create-divider mb-4" />

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="webinarName" className="mb-3">
              <Form.Label>Webinar Name</Form.Label>
              <Form.Control
                type="text"
                value={webinarDetails.WebinarName || ""}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="webinarSpeaker" className="mb-3">
              <Form.Label>Speaker</Form.Label>
              <Form.Control
                type="text"
                value={webinarDetails.Speaker || ""}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="webinarDate" className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                value={
                  webinarDetails.Date
                    ? new Date(webinarDetails.Date).toLocaleDateString()
                    : ""
                }
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="webinarTime" className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                value={
                  webinarDetails.StartTime && webinarDetails.EndTime
                    ? `${webinarDetails.StartTime} - ${webinarDetails.EndTime}`
                    : ""
                }
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="webinarDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={webinarDetails.WebinarDesc || ""}
            disabled
          />
        </Form.Group>

        <Form.Group controlId="webinarLink" className="mb-3">
          <Form.Label>Webinar Link</Form.Label>
          <Form.Control
            type="text"
            value={webinarDetails.Link || ""}
            disabled
          />
        </Form.Group>

        <Form.Group controlId="webinarImage" className="mb-3">
          <Form.Label>Webinar Image</Form.Label>
          <div className="d-flex align-items-center">
            <img
              src={webinarDetails.imageUrl || "/img/default.jpg"}
              alt="Webinar"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
              }}
            />
          </div>
        </Form.Group>

        <div className="admin-view-button-group mt-4">
          <Button
            variant="warning"
            className="me-2"
            onClick={() => navigate(`/admin-edit-webinar/${id}`)}
            style={{
              backgroundColor: "#fbbf24",
              color: "black",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
          >
            Edit Webinar
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            style={{
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Back
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminViewWebinarDetails;
