import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaShoppingCart, FaDollarSign, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [inProgressTicketsCount, setInProgressTicketsCount] = useState(0);
  const [upcomingBookingsCount, setUpcomingBookingsCount] = useState(0);

  // Display current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://localhost:8000/payment");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const payments = await response.json();

        // Filter and count pending payments
        const pendingPayments = payments.filter(
          (payment) => payment.Status === "Pending"
        );
        setPendingPaymentsCount(pendingPayments.length);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8000/ticketing");
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const tickets = await response.json();

        const openTickets = tickets.filter(
          (ticket) => ticket.Status === "Open"
        );
        const inProgressTickets = tickets.filter(
          (ticket) => ticket.Status === "In Progress"
        );

        setOpenTicketsCount(openTickets.length);
        setInProgressTicketsCount(inProgressTickets.length);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:8000/booking");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const bookings = await response.json();

        const currentDate = new Date();
        const upcomingBookings = bookings.filter(
          (booking) => new Date(booking.Date) >= currentDate
        );
        setUpcomingBookingsCount(upcomingBookings.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchPayments();
    fetchTickets();
    fetchBookings();
  }, []);

  return (
    <div className="d-flex">
      {/* Main Content */}
      <Container fluid className="p-4">
        <h1 className="admin-greeting">Welcome Back, Admin!</h1>
        <p className="text-muted">{formattedDate}</p>
        <br></br>
        <p className="admin-status">You have...</p>
        <h4 className="pending-invoices">
          {pendingPaymentsCount} Pending Invoice Confirmations
        </h4>
        <h4 className="pending-invoices">{openTicketsCount} Open Tickets</h4>
        <h4 className="pending-invoices">
          {inProgressTicketsCount} Tickets In Progress
        </h4>
        <h4 className="pending-invoices">
          {upcomingBookingsCount} Upcoming Bookings
        </h4>

        <h5 className="shortcuts-title mt-4">Access:</h5>
        <Row className="mt-3">
          <Col md={4} className="d-flex justify-content-center">
            <Link to="/admin-view-program" className="w-100">
              <Card className="shortcut-card text-center shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaShoppingCart size={40} className="shortcut-icon mb-3" />
                  <Card.Title className="shortcut-title">Program</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="d-flex justify-content-center">
            <Link to="/admin-view-payment" className="w-100">
              <Card className="shortcut-card text-center shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaEnvelope size={40} className="shortcut-icon mb-3" />
                  <Card.Title className="shortcut-title">
                    Registration
                  </Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="d-flex justify-content-center">
            <Link to="/admin-view-announcement" className="w-100">
              <Card className="shortcut-card text-center shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaDollarSign size={40} className="shortcut-icon mb-3" />
                  <Card.Title className="shortcut-title">
                    Announcement
                  </Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminHome;
