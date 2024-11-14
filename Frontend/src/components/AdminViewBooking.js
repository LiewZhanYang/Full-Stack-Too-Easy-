import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminViewBooking = () => {
  const [bookings, setBookings] = useState([]);
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
    return bookings.map((booking) => (
      <Card
        key={booking.BookingID}
        className="admin-booking-card mb-3 p-3"
        style={{ textAlign: "left" }}
      >
        <Card.Body>
          <Card.Title className="admin-booking-id">
            Booking ID: {booking.BookingID}
          </Card.Title>
          <Card.Text className="admin-booking-text">
            Date: {new Date(booking.Date).toLocaleDateString()}
          </Card.Text>
          <Card.Text className="admin-booking-text">
            Time: {formatTime(booking.Time)}
          </Card.Text>
          <Button
          onClick={() => handleStartCoaching(booking.BookingID)}
          style={{
            backgroundColor: "#fbbf24",
            color: "black",
            borderRadius: "8px", // Matches your desired radius
            padding: "8px 16px", // Keeps the size consistent
            fontSize: "14px", // Ensures text size remains the same
            fontWeight: "500", // Use medium weight
            textDecoration: "none",
            transition: "background-color 0.2s ease-in-out",
            cursor: "pointer",
            border: "none", // Removes border styling
            marginTop: "20px", 
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
        >
          Start Coaching
        </Button>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <Container fluid className="admin-bookings-page p-4">
      <h2 className="precoaching-title">All Bookings</h2>
      <br />
      <Row>
        <Col>{renderBookings()}</Col>
      </Row>
    </Container>
  );
};

export default AdminViewBooking;
