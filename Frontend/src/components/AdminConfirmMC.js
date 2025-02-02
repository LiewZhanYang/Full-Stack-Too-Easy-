import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminConfirmTransfer = () => {
  const navigate = useNavigate();
  const { transferID } = useParams(); // Get the TransferID from the URL
  const [transferDetails, setTransferDetails] = useState(null);

  // Fetch transfer details on component load
  useEffect(() => {
    const fetchTransferDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/transfer-requests/${transferID}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched Transfer Details:", data);
        setTransferDetails(data);
      } catch (error) {
        console.error("Error fetching transfer details:", error);
      }
    };

    fetchTransferDetails();
  }, [transferID]);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleConfirmClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transfer-requests/${transferID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Status: "Confirmed" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve transfer request");
      }
      alert("Transfer Approved");
      navigate(-1); // Navigate back to the first page
    } catch (error) {
      console.error("Error approving transfer request:", error);
      alert("Failed to approve the transfer request.");
    }
  };

  const handleRejectClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transfer-requests/${transferID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Status: "Rejected" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject transfer request");
      }
      alert("Transfer Rejected");
      navigate(-1); // Navigate back to the first page
    } catch (error) {
      console.error("Error rejecting transfer request:", error);
      alert("Failed to reject the transfer request.");
    }
  };

  if (!transferDetails) {
    return (
      <Container className="p-4">
        <h2>Loading transfer details...</h2>
      </Container>
    );
  }

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
              <strong>Account ID:</strong>
              <br />
              {transferDetails.AccountID}
            </p>
            <p>
              <strong>Program Name:</strong>
              <br />
              {transferDetails.ProgramName}
            </p>
            <p>
              <strong>New Session:</strong>
              <br />
              Date: {transferDetails.NewSession.Date} <br />
              Time: {transferDetails.NewSession.Time} <br />
              Location: {transferDetails.NewSession.Location}
            </p>
            <p>
              <strong>Reason for Transfer:</strong>
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
            {transferDetails.MCPath ? (
              <a
                href={transferDetails.MCPath}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
            ) : (
              <div className="admin-confirm-screenshot-placeholder">
                <p>No document available</p>
              </div>
            )}
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
