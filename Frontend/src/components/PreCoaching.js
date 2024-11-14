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

  const handleNavigateToBooking = () => {
    navigate("/booking");
  };

  const handleNavigateToCoaching = (id) => {
    navigate(`/coaching/${id}`);
  };

  useEffect(() => {
    const fetchBookingByAccountID = async () => {
      const id = localStorage.getItem("userId");
      if (id) {
        try {
          const response = await fetch(`http://localhost:8000/booking/${id}`);
          const data = await response.json();
          console.log("Fetched Booking Data:", data); // Debugging data
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

  useEffect(() => {
    if (bookingData) {
      console.log("Booking data set, running initial status update"); // Check if this logs
      updateStatusMessage(); // Initial call to set status message
      const interval = setInterval(() => {
        updateStatusMessage();
      }, 60000); // Update every minute
      return () => clearInterval(interval); // Clear interval on cleanup
    }
  }, [bookingData]);

  const updateStatusMessage = () => {
    if (bookingData) {
      const {
        Date: bookingDateISO,
        StartTime: startTimeStr,
        EndTime: endTimeStr,
      } = bookingData;

      // Log the raw data values to check their format
      console.log("Raw Date Value:", bookingDateISO);
      console.log("Raw Start Time Value:", startTimeStr);
      console.log("Raw End Time Value:", endTimeStr);

      // Parse the ISO date string
      const baseDate = new Date(bookingDateISO);

      // Check if the base date is valid
      if (!isNaN(baseDate) && startTimeStr && endTimeStr) {
        // Split start and end times into hours and minutes
        const startTimeParts = startTimeStr.split(":").map(Number);
        const endTimeParts = endTimeStr.split(":").map(Number);

        if (startTimeParts.length >= 2 && endTimeParts.length >= 2) {
          // Create start and end Date objects by modifying the base date
          const startTime = new Date(baseDate);
          startTime.setHours(startTimeParts[0], startTimeParts[1], 0, 0);

          const endTime = new Date(baseDate);
          endTime.setHours(endTimeParts[0], endTimeParts[1], 0, 0);

          const now = new Date();

          console.log("Current Time:", now);
          console.log("Meeting Start Time:", startTime);
          console.log("Meeting End Time:", endTime);

          const timeDifference = (startTime - now) / 60000; 

          if (now >= startTime && now <= endTime) {
            console.log("Condition met: Within meeting time range");
            setStatusMessage("You can join the meeting now.");
          } else if (timeDifference > 10) {
            console.log("Condition met: More than 10 minutes before meeting");
            setStatusMessage("Meeting has not started.");
          } else if (timeDifference <= 10 && now < startTime) {
            console.log("Condition met: 10 minutes before meeting start");
            setStatusMessage("The meeting will start soon. Get ready to join.");
          } else if (now > endTime) {
            console.log("Condition met: Meeting has ended");
            setStatusMessage("The meeting has ended.");
          }
        } else {
          console.log(
            "Invalid time format for Start or End time. Expected HH:MM or HH:MM:SS."
          );
        }
      } else {
        console.log("Invalid base date or missing time data.");
      }
    } else {
      console.log("No booking data available to determine status");
    }
  };

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

              <div className="d-flex justify-content-start mt-3">
                <Button
                  className="btn btn-warning me-3 px-4 join-button"
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
              </div>
            </div>
            <p
              className="text-muted text-center mt-3"
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-info-circle me-1"></i> Only one session may be
              booked at a time.
            </p>
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

      {/* Cancellation Confirmation Modal */}
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
