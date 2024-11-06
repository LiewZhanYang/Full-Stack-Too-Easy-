import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';

const AdminViewPayment = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingPayments = [
    { id: '12345678', name: 'John Doe', contact: '8123 4567' },
    { id: '12345678', name: 'John Doe', contact: '8123 4567' },
    { id: '12345678', name: 'John Doe', contact: '8123 4567' },
    { id: '12345678', name: 'John Doe', contact: '8123 4567' },
  ];

  const confirmedPayments = [
    { id: '87654321', name: 'Jane Smith', contact: '8123 4568' },
    { id: '87654321', name: 'Jane Smith', contact: '8123 4568' },
  ];

  const handleSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  const renderPayments = (payments) => (
    payments.map((payment, index) => (
      <Card key={index} className="admin-payment-card mb-3 p-3">
        <Card.Body>
          <Card.Title className="admin-payment-order-id">Order ID: {payment.id}</Card.Title>
          <Card.Text className="admin-payment-text">{payment.name}</Card.Text>
          <Card.Text className="admin-payment-text">{payment.contact}</Card.Text>
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
