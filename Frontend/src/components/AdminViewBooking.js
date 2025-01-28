import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminViewBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  // Fetch all bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Attempting to fetch bookings...");
        const response = await fetch("http://localhost:8000/booking");
        if (!response.ok)
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );

        let bookingData = await response.json();
        console.log("Fetched bookings:", bookingData);

        // Sort bookings by nearest date
        bookingData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

        setBookings(bookingData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on the active tab
  const filterBookings = () => {
    const currentDate = new Date();
    if (activeTab === "upcoming") {
      return bookings.filter(
        (booking) => new Date(booking.Date) >= currentDate
      );
    } else if (activeTab === "past") {
      return bookings.filter((booking) => new Date(booking.Date) < currentDate);
    }
    return bookings;
  };

  // Navigate directly to AdminCoaching page for the specific booking
  const handleStartCoaching = (bookingID) => {
    navigate(`/admin-coaching/${bookingID}`);
  };

  // Format time in 12-hour AM/PM format
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderBookings = () => {
    const filteredBookings = filterBookings();

    if (filteredBookings.length === 0) {
      return <p ><br></br>No bookings available.</p>;
    }

    return filteredBookings.map((booking) => (
      <Card
        key={booking.BookingID}
        className="admin-payment-card mb-3 p-3"
        onClick={() => handleStartCoaching(booking.BookingID)}
        style={{
          cursor: "pointer",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <Card.Body>
          <Card.Title
            className="admin-payment-order-id"
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#374151",
              marginBottom: "10px",
            }}
          >
            Booking ID: {booking.BookingID}
          </Card.Title>
          <Card.Text
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              marginBottom: "5px",
            }}
          >
            Date: {new Date(booking.Date).toLocaleDateString()}
          </Card.Text>
          <Card.Text
            style={{
              fontSize: "1rem",
              color: "#6b7280",
            }}
          >
            Time: {formatTime(booking.StartTime)} -{" "}
            {formatTime(booking.EndTime)}
          </Card.Text>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <Container fluid className="admin-bookings-page p-4">
      <h2 className="precoaching-title">All Bookings</h2>

      {/* Tabs for Upcoming and Past Bookings */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(selectedTab) => setActiveTab(selectedTab)}
        className="mb-3"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="upcoming"
            className="admin-bookings-tab"
            style={{
              color: activeTab === "upcoming" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "upcoming" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom:
                activeTab === "upcoming"
                  ? "2px solid #f59e0b"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.3s ease, border-bottom-color 0.3s ease",
            }}
          >
            Upcoming
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="past"
            className="admin-bookings-tab"
            style={{
              color: activeTab === "past" ? "#f59e0b" : "#6b7280",
              fontWeight: activeTab === "past" ? "bold" : "normal",
              padding: "10px 20px",
              textAlign: "center",
              borderBottom:
                activeTab === "past"
                  ? "2px solid #f59e0b"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.3s ease, border-bottom-color 0.3s ease",
            }}
          >
            Past
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col>{renderBookings()}</Col>
      </Row>
    </Container>
  );
};

export default AdminViewBooking;
