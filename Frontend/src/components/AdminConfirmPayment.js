import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaImage } from "react-icons/fa";

const AdminConfirmPayment = () => {
  const [paymentDetails, setPaymentDetails] = useState({});
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get the payment ID from the URL

  // Fetch payment details from backend on component load
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/payment/${id}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch payment details: ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Fetched payment details:", data); // Log the entire data object
        setPaymentDetails(data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleConfirmClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/payment/approvepayment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ AdminID: 1 }), // Example AdminID, replace as necessary
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve payment");
      }
      console.log("Payment Confirmed");
      navigate(-1); // Navigate back after confirming
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  const handleRejectClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/payment/rejectpayment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ AdminID: 1, Reason: rejectionReason }), // Include AdminID and rejection reason
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject payment");
      }
      console.log("Payment Rejected:", rejectionReason);
      navigate(-1); // Navigate back after rejecting
    } catch (error) {
      console.error("Error rejecting payment:", error);
    }
  };

  // Determine the class for the status text based on the status
  const getStatusClass = (status) => {
    if (status === "Approved") return "text-success"; // Green text for Approved
    if (status === "Rejected") return "text-danger"; // Red text for Rejected
    return ""; // Default text color for other statuses like "Pending"
  };

  // Function to display status text based on the status value
  const getStatusText = (status) => {
    if (status === "Approved") return "Confirmed (Approved)";
    if (status === "Rejected") return "Confirmed (Rejected)";
    return status; // Display the original status if it's not Approved or Rejected
  };

  return (
    <Container fluid className="admin-confirm-payment-page p-4">
      <Row className="mb-3">
        <Col>
          <h2 className="admin-confirm-title">Admin Console</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="link"
            className="admin-confirm-back-button"
            onClick={handleBackClick}
          >
            Back <FaArrowLeft />
          </Button>
        </Col>
      </Row>
      <hr className="admin-confirm-divider mb-4" />

      <Row>
        <Col md={6}>
          <div className="admin-confirm-details">
            <p>
              <strong>Invoice ID</strong>
              <br />
              {paymentDetails.InvoiceID}
            </p>
            <p>
              <strong>Full Name</strong>
              <br />
              {paymentDetails.FullName || "N/A"}
            </p>
            <p>
              <strong>Phone Number</strong>
              <br />
              {paymentDetails.PhoneNumber || "N/A"}
            </p>
            <p>
              <strong>Total Payment Amount:</strong>
              <br />${paymentDetails.Amount}
            </p>

            {/* Status display with conditional styling */}
            <p>
              <strong>Status:</strong>
              <br />
              <span className={getStatusClass(paymentDetails.Status)}>
                {getStatusText(paymentDetails.Status)}
              </span>
            </p>

            {/* Show rejection reason field only if the status is "Pending" */}
            {paymentDetails.Status === "Pending" && (
              <Form.Group controlId="rejectionReason" className="mt-3">
                <Form.Label>Reason (for rejection only):</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Eg. Incorrect payment amount"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </Form.Group>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="admin-confirm-screenshot-preview">
            <p>
              <strong>Screenshot Preview:</strong>
            </p>
            <div className="admin-confirm-screenshot-placeholder">
              <FaImage className="admin-confirm-screenshot-icon" />
            </div>
          </div>
        </Col>
      </Row>

      {/* Show Confirm and Reject buttons only if the status is "Pending" */}
      {paymentDetails.Status === "Pending" && (
        <div className="admin-confirm-button-group mt-4">
          <Button
            variant="warning"
            className="admin-confirm-confirm-button me-3"
            onClick={handleConfirmClick}
          >
            Confirm
          </Button>
          <Button
            variant="danger"
            className="admin-confirm-reject-button"
            onClick={handleRejectClick}
          >
            Reject
          </Button>
        </div>
      )}
    </Container>
  );
};

export default AdminConfirmPayment;
