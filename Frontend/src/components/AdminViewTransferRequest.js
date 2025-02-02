import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminViewTransferRequest = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  // State to store pending and confirmed transfer requests
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [confirmedTransfers, setConfirmedTransfers] = useState([]);

  // Fetch transfer requests from backend when the component loads
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await fetch("http://localhost:8000/transfer-requests"); // Replace with your actual backend URL
        const data = await response.json();

        // Filter the requests based on their status
        setPendingTransfers(data.filter((req) => req.Status === "Pending"));
        setConfirmedTransfers(data.filter((req) => req.Status === "Confirmed"));
      } catch (error) {
        console.error("Error fetching transfer requests:", error);
      }
    };

    fetchTransfers();
  }, []);

  // Handle tab selection (Pending or Confirmed)
  const handleSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  // Navigate to the confirm transfer request page when a card is clicked
  const handleCardClick = (transferID) => {
    navigate(`/admin-confirm-transfer/${transferID}`);
  };

  // Render transfer requests dynamically
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
            className="admin-bookings-tab"
            style={{
              color: activeTab === "pending" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "pending" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom:
                activeTab === "pending"
                  ? "2px solid #f59e0b"
                  : "2px solid transparent",
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
            eventKey="confirmed"
            style={{
              color: activeTab === "confirmed" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "confirmed" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom:
                activeTab === "confirmed"
                  ? "2px solid #f59e0b"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.3s ease, border-bottom-color 0.3s ease",
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
