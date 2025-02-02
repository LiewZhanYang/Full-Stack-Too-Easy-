import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminViewTransferRequest = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [confirmedTransfers, setConfirmedTransfers] = useState([]);

  // Fetch transfer requests from the backend
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await fetch("http://localhost:8000/transfer-requests");
        const data = await response.json();
        console.log("API Response:", data);

        setPendingTransfers(data.filter((req) => req.Status === "Pending"));
        setConfirmedTransfers(data.filter((req) => req.Status === "Confirmed"));
      } catch (error) {
        console.error("Error fetching transfer requests:", error);
      }
    };

    fetchTransfers();
  }, []);

  const handleSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  const handleCardClick = (transferID) => {
    // Navigate to the admin-confirm-mc page with TransferID as a route parameter
    navigate(`/admin-confirm-mc`);
  };

  const renderTransfers = (transfers) => {
    return transfers.map((transfer) => (
      <Card
        key={transfer.TransferID}
        className="admin-payment-card mb-3 p-3"
        onClick={() => handleCardClick(transfer.TransferID)}
        style={{ cursor: "pointer" }}
      >
        <Card.Body>
          <Card.Title className="admin-payment-order-id">
            Account ID: {transfer.AccountID}
          </Card.Title>
          <Card.Text className="admin-payment-text">
            Program Name: {transfer.ProgramName}
          </Card.Text>
          <Card.Text className="admin-payment-text">
            Reason: {transfer.Reason}
          </Card.Text>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <Container fluid className="admin-payments-page p-4">
      <h2 className="admin-payments-title">Transfer Requests</h2>
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
            style={{
              color: activeTab === "pending" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "pending" ? "bold" : "normal",
              borderBottom:
                activeTab === "pending"
                  ? "2px solid #f59e0b"
                  : "2px solid transparent",
            }}
          >
            Pending
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="confirmed"
            style={{
              color: activeTab === "confirmed" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "confirmed" ? "bold" : "normal",
              borderBottom:
                activeTab === "confirmed"
                  ? "2px solid #f59e0b"
                  : "2px solid transparent",
            }}
          >
            Confirmed
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col>
          {activeTab === "pending"
            ? renderTransfers(pendingTransfers)
            : renderTransfers(confirmedTransfers)}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminViewTransferRequest;
