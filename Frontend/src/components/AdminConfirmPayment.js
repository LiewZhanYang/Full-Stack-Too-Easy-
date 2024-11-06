import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage } from 'react-icons/fa';

const AdminConfirmPayment = () => {
  const [rejectionReason, setRejectionReason] = useState('');
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleConfirmClick = () => {
    // Add logic for confirming the payment
    console.log('Payment Confirmed');
  };

  const handleRejectClick = () => {
    // Add logic for rejecting the payment with the provided reason
    console.log('Payment Rejected:', rejectionReason);
  };

  return (
    <Container fluid className="admin-confirm-payment-page p-4">
      <Row className="mb-3">
        <Col>
          <h2 className="admin-confirm-title">Admin Console</h2>
        </Col>
        <Col className="text-end">
          <Button variant="link" className="admin-confirm-back-button" onClick={handleBackClick}>
            Back <FaArrowLeft />
          </Button>
        </Col>
      </Row>
      <hr className="admin-confirm-divider mb-4" />

      <Row>
        <Col md={6}>
          <div className="admin-confirm-details">
            <p><strong>Invoice ID</strong><br />12345678</p>
            <p><strong>Full Name</strong><br />John Doe</p>
            <p><strong>Phone Number</strong><br />8123 4567</p>
            <p><strong>Total Payment Amount:</strong><br />$788.00</p>
            
            <Form.Group controlId="rejectionReason" className="mt-3">
              <Form.Label>Reason (for rejection only):</Form.Label>
              <Form.Control
                type="text"
                placeholder="Eg. Incorrect payment amount"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </Form.Group>
          </div>
        </Col>

        <Col md={6}>
          <div className="admin-confirm-screenshot-preview">
            <p><strong>Screenshot Preview:</strong></p>
            <div className="admin-confirm-screenshot-placeholder">
              <FaImage className="admin-confirm-screenshot-icon" />
            </div>
          </div>
        </Col>
      </Row>

      <div className="admin-confirm-button-group mt-4">
        <Button variant="warning" className="admin-confirm-confirm-button me-3" onClick={handleConfirmClick}>
          Confirm
        </Button>
        <Button variant="danger" className="admin-confirm-reject-button" onClick={handleRejectClick}>
          Reject
        </Button>
      </div>
    </Container>
  );
};

export default AdminConfirmPayment;
