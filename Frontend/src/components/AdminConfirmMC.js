import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminConfirmTransfer = () => {
  const navigate = useNavigate();
  const { transferID } = useParams(); // Get the TransferID from the URL
  const [transferDetails, setTransferDetails] = useState(null);

  // Hardcoded fallback data
  const hardcodedData = {
    AccountID: "12345",
    ProgramName: "Coding Bootcamp",
    Reason: "Medical emergency",
    MCPath: "https://via.placeholder.com/300", // Replace with a real document URL for testing
    RequestedAt: "2025-02-02T02:56:37.000Z",
    Status: "Pending",
  };

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
        setTransferDetails(data);
      } catch (error) {
        console.error("Error fetching transfer details:", error);
        // Use hardcoded data if API call fails
        setTransferDetails(hardcodedData);
      }
    };

    fetchTransferDetails();
  }, [transferID]);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleConfirmClick = () => {
    alert("Transfer Approved (Simulated)");
    navigate(-1); // Simulate navigation back after approval
  };

  const handleRejectClick = () => {
    alert("Transfer Rejected (Simulated)");
    navigate(-1); // Simulate navigation back after rejection
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
              {transferDetails
                ? transferDetails.AccountID
                : hardcodedData.AccountID}
            </p>
            <p>
              <strong>Program Name</strong>
              <br />
              {transferDetails
                ? transferDetails.ProgramName
                : hardcodedData.ProgramName}
            </p>
            <p>
              <strong>Reason for Transfer</strong>
              <br />
              {transferDetails ? transferDetails.Reason : hardcodedData.Reason}
            </p>
            <p>
              <strong>Requested At</strong>
              <br />
              {transferDetails
                ? transferDetails.RequestedAt
                : hardcodedData.RequestedAt}
            </p>
            <p>
              <strong>Status</strong>
              <br />
              {transferDetails ? transferDetails.Status : hardcodedData.Status}
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className="admin-confirm-screenshot-preview">
            <p>
              <strong>Medical Certificate:</strong>
            </p>
            {transferDetails?.MCPath || hardcodedData.MCPath ? (
              <a
                href={transferDetails?.MCPath || hardcodedData.MCPath}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
            ) : (
              <p>No document available</p>
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
