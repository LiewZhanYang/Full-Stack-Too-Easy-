import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminConfirmTransfer = () => {
  const navigate = useNavigate();
  const { transferID } = useParams(); // Get the TransferID from the URL
  const [transferDetails, setTransferDetails] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalTitle, setModalTitle] = useState(""); // State to set modal title
  const [modalMessage, setModalMessage] = useState(""); // State to set modal message

  useEffect(() => {
    const fetchTransferDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/transfer-requests/${transferID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transfer details");
        }
        const data = await response.json();
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

      setModalTitle("Transfer Approved");
      setModalMessage("The transfer request has been successfully approved.");
      setShowModal(true);
    } catch (error) {
      console.error("Error approving transfer request:", error);
      setModalTitle("Error");
      setModalMessage("Failed to approve the transfer request.");
      setShowModal(true);
    }
  };

  const handleRejectClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transfer-requests/${transferID}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject transfer request");
      }

      setModalTitle("Transfer Rejected");
      setModalMessage("The transfer request has been successfully rejected.");
      setShowModal(true);
    } catch (error) {
      console.error("Error rejecting transfer request:", error);
      setModalTitle("Error");
      setModalMessage("Failed to reject the transfer request.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/admin-view-transfer-request"); // Navigate back to transfer request page after modal closes
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
              <strong>Account ID</strong>
              <br />
              {transferDetails.AccountID}
            </p>
            <p>
              <strong>Program Name</strong>
              <br />
              {transferDetails.ProgramName}
            </p>
            <p>
              <strong>Reason for Transfer</strong>
              <br />
              {transferDetails.Reason}
            </p>
            <p>
              <strong>Requested At</strong>
              <br />
              {transferDetails.RequestedAt}
            </p>
            <p>
              <strong>Status</strong>
              <br />
              {transferDetails.Status}
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

      {/* Modal for showing approval/rejection message */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminConfirmTransfer;
