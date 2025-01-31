import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminViewTicket = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [openTickets, setOpenTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8000/ticketing");
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const tickets = await response.json();

        const open = tickets.filter((ticket) => ticket.Status === "Open");
        const inProgress = tickets.filter(
          (ticket) => ticket.Status === "In Progress"
        );
        const resolved = tickets.filter(
          (ticket) => ticket.Status === "Resolved"
        );

        setOpenTickets(open);
        setInProgressTickets(inProgress);
        setResolvedTickets(resolved);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

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
            Issue: {ticket.Category} - {ticket.Content}
          </Card.Text>
          <Card.Text className="admin-payment-text">
            Status: {ticket.Status}
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
            eventKey="open"
            style={{
              color: activeTab === "open" ? "#DCAF27" : "#6b7280",
              fontWeight: activeTab === "open" ? "bold" : "normal",
              borderBottom:
                activeTab === "open"
                  ? "2px solid #DCAF27"
                  : "2px solid transparent",
            }}
          >
            Open
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="in-progress"
            style={{
              color: activeTab === "in-progress" ? "#DCAF27" : "#6b7280",
              fontWeight: activeTab === "in-progress" ? "bold" : "normal",
              borderBottom:
                activeTab === "in-progress"
                  ? "2px solid #DCAF27"
                  : "2px solid transparent",
            }}
          >
            In Progress
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="resolved"
            style={{
              color: activeTab === "resolved" ? "#DCAF27" : "#6b7280",
              fontWeight: activeTab === "resolved" ? "bold" : "normal",
              borderBottom:
                activeTab === "resolved"
                  ? "2px solid #DCAF27"
                  : "2px solid transparent",
            }}
          >
            Resolved
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col>
          {activeTab === "open" && renderTickets(openTickets)}
          {activeTab === "in-progress" && renderTickets(inProgressTickets)}
          {activeTab === "resolved" && renderTickets(resolvedTickets)}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminViewTicket;
