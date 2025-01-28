import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AdminConfirmPayment = () => {
  //
  const [paymentDetails, setPaymentDetails] = useState({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(null); // State to store screenshot URL
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
        setPaymentDetails(data);

        // Fetch screenshot URL if available
        if (data.screenshotUrl) {
          setScreenshotUrl(data.screenshotUrl);
        }
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
      // Approve the payment
      const response = await fetch(
        `http://localhost:8000/payment/approvepayment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ AdminID: 1 }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve payment");
      }
      console.log("Payment Confirmed");

      // Update customer's membership status if payment is confirmed
      const accountId = paymentDetails.PaidBy;
      if (accountId) {
        const membershipResponse = await fetch(
          `http://localhost:8000/customer/member/${accountId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!membershipResponse.ok) {
          throw new Error("Failed to update customer membership status");
        }
        console.log("Customer membership status updated");
      }

      setShowConfirmModal(false); // Close the confirmation modal
      setShowSuccessModal(true); // Show the success modal
    } catch (error) {
      console.error("Error confirming payment or updating membership:", error);
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

  const getStatusClass = (status) => {
    if (status === "Approved") return "text-success";
    if (status === "Rejected") return "text-danger";
    return "";
  };

  const getStatusText = (status) => {
    if (status === "Approved") return "Confirmed (Approved)";
    if (status === "Rejected") return "Confirmed (Rejected)";
    return status;
  };

  return (
    <Container fluid className="admin-confirm-payment-page p-4">
      <Row className="mb-3">
        <Col>
          <h2 className="admin-confirm-title">Confirm Payment</h2>
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
              <strong>Order ID</strong>
              <br />
              {paymentDetails.OrderID}
            </p>
            <p>
              <strong>Invoice ID</strong>
              <br />
              {paymentDetails.InvoiceID}
            </p>
            <p>
              <strong>Full Name</strong>
              <br />
              {paymentDetails.Name}
            </p>
            <p>
              <strong>Phone Number</strong>
              <br />
              {paymentDetails.ContactNo}
            </p>
            <p>
              <strong>Total Payment Amount:</strong>
              <br />${paymentDetails.Amount}
            </p>

            <p>
              <strong>Status:</strong>
              <br />
              <span className={getStatusClass(paymentDetails.Status)}>
                {getStatusText(paymentDetails.Status)}
              </span>
            </p>

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
            {screenshotUrl ? (
              <img
                src={screenshotUrl}
                alt="Payment Screenshot"
                className="img-fluid rounded"
                style={{ maxHeight: "300px" }}
              />
            ) : (
              <div className="admin-confirm-screenshot-placeholder">
                <p>No screenshot available</p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {paymentDetails.Status === "Pending" && (
        <div className="admin-confirm-button-group mt-4">
          <Button
            style={{
              backgroundColor: "#fbbf24", 
              color: "black",
            }}
            className="admin-confirm-confirm-button me-3"
            onClick={() => setShowConfirmModal(true)}
          >
            Confirm
          </Button>
          <Button
            style={{
              backgroundColor: "#dc3545",
              color: "white",
            }}
            className="admin-confirm-reject-button"
            onClick={handleRejectClick}
          >
            Reject
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to approve this payment?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmClick}>
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Approved</Modal.Title>
        </Modal.Header>
        <Modal.Body>The payment has been approved successfully.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate(-1);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminConfirmPayment;
