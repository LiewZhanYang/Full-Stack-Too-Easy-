import React, { useState } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminViewTicket = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  const pendingTickets = [
    { TicketID: 1, AccountID: "A123", Issue: "Payment not processed" },
    { TicketID: 2, AccountID: "B456", Issue: "Unable to access course materials" },
  ];

  const resolvedTickets = [
    { TicketID: 3, AccountID: "C789", Issue: "Login issue resolved" },
  ];

  const handleSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  const handleCardClick = (ticketID) => {
    navigate(`/admin-view-ticket/${ticketID}`);
  };

  const renderTickets = (tickets) => {
    return tickets.map((ticket) => (
      <Card
        key={ticket.TicketID}
        className="admin-payment-card mb-3 p-3"
        onClick={() => handleCardClick(ticket.TicketID)}
        style={{ cursor: "pointer" }}
      >
        <Card.Body>
          <Card.Title className="admin-payment-order-id">
            Account ID: {ticket.AccountID}
          </Card.Title>
          <Card.Text className="admin-payment-text">
            Issue: {ticket.Issue}
          </Card.Text>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <Container fluid className="admin-payments-page p-4">
      <h2 className="admin-payments-title">Support Tickets</h2>
      <hr className="admin-payments-divider mb-4" />

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={handleSelect}
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="pending"
            className="admin-bookings-tab"
            style={{
              color: activeTab === "pending" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "pending" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom: activeTab === "pending" ? "2px solid #f59e0b" : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.3s ease, border-bottom-color 0.3s ease",
              marginLeft: "10px",
            }}
          >
            Pending
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="resolved"
            style={{
              color: activeTab === "resolved" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "resolved" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom: activeTab === "resolved" ? "2px solid #f59e0b" : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.3s ease, border-bottom-color 0.3s ease",
            }}
          >
            Resolved
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col>
          {activeTab === "pending" ? renderTickets(pendingTickets) : renderTickets(resolvedTickets)}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminViewTicket;
