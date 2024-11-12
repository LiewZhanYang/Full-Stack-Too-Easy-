import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";

const AdminViewPayment = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingPayments, setPendingPayments] = useState([]);
  const [confirmedPayments, setConfirmedPayments] = useState([]);

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

  // Render payments list
  const renderPayments = (payments) => {
    return payments.map((payment) => (
      <Card key={payment.OrderID} className="admin-payment-card mb-3 p-3">
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
      <h2 className="admin-payments-title">Incoming Payments</h2>
      <hr className="admin-payments-divider mb-4" />

      {/* Tabs for Pending and Confirmed Payments */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={handleSelect}
        className="mb-3"
      >
        <Nav.Item>
          <Nav.Link eventKey="pending" className="admin-payments-tab">
            Pending
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="confirmed" className="admin-payments-tab">
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
