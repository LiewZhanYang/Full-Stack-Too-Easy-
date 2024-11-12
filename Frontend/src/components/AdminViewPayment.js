import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';

const AdminViewPayment = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingPayments, setPendingPayments] = useState([]);
  const [confirmedPayments, setConfirmedPayments] = useState([]);

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:8000/payment'); // Adjust the URL if needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const payments = await response.json();

        // Filter payments by approval status
        const pending = payments.filter(payment => payment.ApprovedStatus === 0);
        const confirmed = payments.filter(payment => payment.ApprovedStatus === 1);

        setPendingPayments(pending);
        setConfirmedPayments(confirmed);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const handleSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  const renderPayments = (payments) => (
    payments.map((payment, index) => (
      <Card key={index} className="admin-payment-card mb-3 p-3">
        <Card.Body>
          <Card.Title className="admin-payment-order-id">Invoice ID: {payment.InvoiceID}</Card.Title>
          <Card.Text className="admin-payment-text">Amount: ${payment.Amount}</Card.Text>
          <Card.Text className="admin-payment-text">Contact: {payment.PaidBy}</Card.Text>
        </Card.Body>
      </Card>
    ))
  );

  return (
    <Container fluid className="admin-payments-page p-4">
      <h2 className="admin-payments-title">Incoming Payments</h2>
      <hr className="admin-payments-divider mb-4" />

      <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="pending" className="admin-payments-tab">Pending</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="confirmed" className="admin-payments-tab">Confirmed</Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col>
          {activeTab === 'pending' ? renderPayments(pendingPayments) : renderPayments(confirmedPayments)}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminViewPayment;
