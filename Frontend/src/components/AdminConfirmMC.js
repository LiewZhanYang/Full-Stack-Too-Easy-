import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminConfirmTransfer = () => {
  const navigate = useNavigate();
  const transferDetails = {
    TransferID: 1,
    AccountID: "A123",
    ProgramName: "Coding Bootcamp",
    CurrentSession: {
      Date: "1/4/2025",
      Time: "10:00:00",
      Location: "Auditorium A",
    },
    NewSession: {
      Date: "31/3/2025",
      Time: "10:00:00",
      Location: "Auditorium A",
    },
    Reason: "Fever",
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleConfirmClick = () => {
    alert("Transfer Approved");
    navigate(-1);
  };

  const handleRejectClick = () => {
    alert("Transfer Rejected");
    navigate(-1);
  };

  return (
    <Container fluid className="admin-confirm-payment-page p-4">
      <Row className="mb-3">
        <Col>
          <h2 className="admin-confirm-title">Confirm Transfer Request</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="link"
            className="admin-confirm-back-button"
            onClick={handleBackClick}
          >
            Back
          </Button>
        </Col>
      </Row>
      <hr className="admin-confirm-divider mb-4" />

      <Row>
        <Col md={6}>
          <div className="admin-confirm-details">
            <p>
              <strong>Account ID</strong>
              <br />
              {transferDetails.AccountID}
            </p>
            <p>
              <strong>Current Program</strong>
              <br />
              {transferDetails.ProgramName}
            </p>
            <p>
              <strong>Current Session</strong>
              <br />
              Date: {transferDetails.CurrentSession.Date} <br />
              Time: {transferDetails.CurrentSession.Time} <br />
              Location: {transferDetails.CurrentSession.Location}
            </p>
            <p>
              <strong>New Session</strong>
              <br />
              Date: {transferDetails.NewSession.Date} <br />
              Time: {transferDetails.NewSession.Time} <br />
              Location: {transferDetails.NewSession.Location}
            </p>
            <p>
              <strong>Reason for Transfer</strong>
              <br />
              {transferDetails.Reason}
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className="admin-confirm-screenshot-preview">
            <p>
              <strong>Medical Certificate:</strong>
            </p>
            <div className="admin-confirm-screenshot-placeholder">
              <p>No document available</p>
            </div>
          </div>
        </Col>
      </Row>

      <div className="admin-confirm-button-group mt-4">
        <Button
          style={{ backgroundColor: "#fbbf24", color: "black" }}
          className="admin-confirm-confirm-button me-3"
          onClick={handleConfirmClick}
        >
          Approve
        </Button>
        <Button
          style={{ backgroundColor: "#dc3545", color: "white" }}
          className="admin-confirm-reject-button"
          onClick={handleRejectClick}
        >
          Reject
        </Button>
      </div>
    </Container>
  );
};

export default AdminConfirmTransfer;
