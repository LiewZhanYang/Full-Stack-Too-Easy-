import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Precoaching() {
  const [hasBooking, setHasBooking] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  // Navigate to the booking page
  const handleNavigateToBooking = () => {
    navigate("/booking");
  };

  // Navigate to a specific coaching session
  const handleNavigateToCoaching = (id) => {
    navigate(`/coaching/${id}`);
  };

  // Fetch booking data on mount
  useEffect(() => {
    const fetchBookingByAccountID = async () => {
      const id = localStorage.getItem("userId");
      if (id) {
        try {
          const response = await fetch(`http://localhost:8000/booking/${id}`);
          const data = await response.json();
          console.log("Fetched Booking Data:", data);
          if (data && data.length > 0) {
            setBookingData(data[0]);
            setHasBooking(true);
          } else {
            setHasBooking(false);
          }
        } catch (error) {
          console.error("Error fetching booking:", error);
        }
      }
    };
    fetchBookingByAccountID();
  }, []);

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Cancel the booking
  const handleCancelBooking = async () => {
    if (bookingData && bookingData.BookingID) {
      try {
        const response = await fetch(
          `http://localhost:8000/booking/${bookingData.BookingID}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          console.log("Booking canceled successfully.");
          setHasBooking(false);
          setBookingData(null);
        } else {
          console.error("Failed to cancel booking.");
        }
      } catch (error) {
        console.error("Error canceling booking:", error);
      } finally {
        setShowCancelModal(false);
      }
    }
  };

  // sync to google calendar
  const handleSyncToGoogleCalendar = () => {
    if (bookingData) {
      const { Date: bookingDateISO, StartTime, EndTime } = bookingData;

      console.log("Raw Date Value:", bookingDateISO);
      console.log("Raw Start Time Value:", StartTime);
      console.log("Raw End Time Value:", EndTime);

      if (!bookingDateISO || !StartTime || !EndTime) {
        console.error("Missing booking data for Google Calendar sync.");
        return;
      }

      // change timings
      const deriveDateTime = (date, time) => {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        const derivedDate = new Date(date);
        derivedDate.setHours(hours, minutes, seconds || 0);
        return derivedDate;
      };

      const startDate = deriveDateTime(bookingDateISO, StartTime);
      const endDate = deriveDateTime(bookingDateISO, EndTime);

      console.log("Derived Start Date:", startDate);
      console.log("Derived End Date:", endDate);

      const formatDateTime = (date) => {
        const pad = (num) => String(num).padStart(2, "0");
        return (
          date.getFullYear() +
          pad(date.getMonth() + 1) +
          pad(date.getDate()) +
          "T" +
          pad(date.getHours()) +
          pad(date.getMinutes()) +
          "00"
        );
      };

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      const title = encodeURIComponent(
        "Mindsphere: 1 to 1 Virtual Coaching Session"
      );
      const details = encodeURIComponent("Join your session with Josh Tan.");
      const location = encodeURIComponent("www.mindsphere.sg");

      // create url
      const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&dates=${formattedStart}/${formattedEnd}&details=${details}&location=${location}`;
      console.log("Google Calendar URL:", calendarUrl);
      window.open(calendarUrl, "_blank");
    }
  };

  return (
    <div className="container mt-1 precoaching-container p-4">
      <h2 className="precoaching-title">1 to 1 Virtual Coaching Session</h2>
      <hr style={{ borderTop: "1px solid #ccc", marginBottom: "1rem" }} />

      {hasBooking && bookingData ? (
        <>
          <p
            className="text-muted"
            style={{ fontSize: "1rem", marginBottom: "1rem" }}
          >
            You have 1 upcoming session
          </p>
          <div className="mt-4">
            <h6 style={{ fontWeight: 500, color: "#333" }}>
              {new Date(bookingData.Date).toLocaleDateString()}
            </h6>
            <div className="card shadow-sm p-3 mb-3 bg-light rounded border-0 session-details-card">
              <div className="row g-2 mb-3">
                <div className="col-4 text-start">
                  <p className="mb-1" style={{ fontWeight: 500 }}>
                    Starts
                  </p>
                  <p>{formatTime(bookingData.StartTime)}</p>
                </div>
                <div className="col-4 text-start">
                  <p className="mb-1" style={{ fontWeight: 500 }}>
                    Ends
                  </p>
                  <p>{formatTime(bookingData.EndTime)}</p>
                </div>
                <div className="col-4 text-start">
                  <p className="mb-1" style={{ fontWeight: 500 }}>
                    Coach
                  </p>
                  <p>Josh Tan</p>
                </div>
              </div>
              <p className="text-start" style={{ color: "#555" }}>
                <strong>Status:</strong> {statusMessage}
              </p>

              <div className="d-flex justify-content-start gap-3 mt-3">
                <Button
                  className="btn btn-warning px-4 join-button"
                  style={{ fontWeight: 500 }}
                  onClick={() =>
                    handleNavigateToCoaching(bookingData.BookingID)
                  }
                >
                  Let's go!
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4 cancel-button"
                  style={{ fontWeight: 500 }}
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel
                </Button>
                <Button
                  className="btn btn-success px-4 calendar-sync-button"
                  style={{ fontWeight: 500 }}
                  onClick={handleSyncToGoogleCalendar}
                >
                  Sync to Google Calendar
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-bookings text-start">
          <p style={{ fontSize: "1rem", color: "#555", marginBottom: "1rem" }}>
            No bookings have been made for 1 to 1 coaching.
          </p>
          <Button
            onClick={handleNavigateToBooking}
            className="custom-booking-button"
          >
            Book a Session
          </Button>
        </div>
      )}

      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this booking?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancelBooking}>
            Yes, Cancel Booking
          </Button>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Precoaching;
