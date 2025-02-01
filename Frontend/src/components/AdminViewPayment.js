import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminViewPayment = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingPayments, setPendingPayments] = useState([]);
  const [confirmedPayments, setConfirmedPayments] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log("Attempting to fetch payments...");
        const response = await fetch("http://localhost:8000/payment"); // GET request to backend
        if (!response.ok)
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );

        const payments = await response.json();
        console.log("Fetched payments:", payments); // Log the fetched payments data

        // Filter payments by status
        const pending = payments.filter(
          (payment) => payment.Status === "Pending"
        );
        const confirmed = payments.filter(
          (payment) =>
            payment.Status === "Approved" || payment.Status === "Rejected"
        );

        console.log("Pending payments (filtered):", pending); // Log filtered pending payments
        console.log("Confirmed payments (filtered):", confirmed); // Log filtered confirmed payments

        setPendingPayments(pending);
        setConfirmedPayments(confirmed);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  // Handle tab selection
  const handleSelect = (selectedTab) => {
    console.log("Selected tab:", selectedTab);
    setActiveTab(selectedTab);
  };

  // Navigate to confirmation page for a specific payment
  const handleCardClick = (orderID) => {
    navigate(`/admin-confirm-payment/${orderID}`);
  };

  // Render payments list
  const renderPayments = (payments) => {
    return payments.map((payment) => (
      <Card
        key={payment.OrderID}
        className="admin-payment-card mb-3 p-3"
        onClick={() => handleCardClick(payment.OrderID)}
        style={{ cursor: "pointer" }}
      >
        <Card.Body>
          <Card.Title className="admin-payment-order-id">
            Invoice ID: {payment.InvoiceID}
          </Card.Title>
          <Card.Text className="admin-payment-text">
            Amount: ${payment.Amount}
          </Card.Text>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <Container fluid className="admin-payments-page p-4">
      <h2 className="precoaching-title">Incoming Payments</h2>

      {/* Tabs for Pending and Confirmed Payments */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={handleSelect}
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "flex-start", // Align tabs to the left
          borderBottom: "2px solid #e5e7eb", // Light gray bottom border
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="pending"
            className="admin-bookings-tab"
            style={{
              color: activeTab === "pending" ? "#DCAF27" : "#6b7280",
              fontWeight: activeTab === "pending" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom:
                activeTab === "pending"
                  ? "2px solid #DCAF27"
                  : "2px solid transparent",
              marginLeft: "10px",
            }}
          >
            Pending
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="confirmed"
            style={{
              color: activeTab === "confirmed" ? "#DCAF27" : "#6b7280",
              fontWeight: activeTab === "confirmed" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom:
                activeTab === "confirmed"
                  ? "2px solid #DCAF27"
                  : "2px solid transparent",
            }}
          >
            Confirmed
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col>
          {/* Display payments based on active tab */}
          {activeTab === "pending"
            ? renderPayments(pendingPayments)
            : renderPayments(confirmedPayments)}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminViewPayment;
