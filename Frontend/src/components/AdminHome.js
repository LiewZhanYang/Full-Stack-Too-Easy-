import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaShoppingCart, FaDollarSign, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminHome = () => {
  // Display current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  return (
    <div className="d-flex">
      {/* Main Content */}
      <Container fluid className="p-4">
        <h1 className="admin-greeting">Welcome Back, Admin!</h1>
        <p className="text-muted">{formattedDate}</p>
        <br></br>
        <p className="admin-status">You have...</p>
        <h4 className="pending-invoices">3 Pending Invoice Confirmations</h4>

        <h5 className="shortcuts-title mt-4">Access:</h5>
        <Row className="mt-3">
          <Col md={4} className="d-flex justify-content-center">
            <Link to="/admin-view-program" className="w-100">
              <Card className="shortcut-card text-center shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaShoppingCart size={40} className="shortcut-icon mb-3" />
                  <Card.Title className="shortcut-title">Program</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="d-flex justify-content-center">
            <Link to="/admin-view-payment" className="w-100">
              <Card className="shortcut-card text-center shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaEnvelope size={40} className="shortcut-icon mb-3" />
                  <Card.Title className="shortcut-title">
                    Registration
                  </Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="d-flex justify-content-center">
          <Link to="/admin-view-announcement" className="w-100">
            <Card className="shortcut-card text-center shadow-sm h-100">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <FaDollarSign size={40} className="shortcut-icon mb-3" />
                <Card.Title className="shortcut-title">Announcement</Card.Title>
              </Card.Body>
            </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminHome;
