import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Precoaching() {
  const [hasBooking, setHasBooking] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  const handleNavigateToBooking = () => {
    navigate("/booking");
  };

  const handleNavigateToCoaching = () => {
    navigate("/coaching"); // Ensure this route corresponds to Coaching.js
  };

  useEffect(() => {
    const fetchBookingByAccountID = async () => {
      const accountId = localStorage.getItem("userId"); // Retrieve AccountID from localStorage
      console.log("Account ID:", accountId); // Log Account ID for debugging
      if (accountId) {
        try {
          const response = await fetch(
            `http://localhost:8000/booking/${accountId}`
          );
          const data = await response.json();
          console.log("User Booking Data:", data); // Log booking data for debugging
          if (data && data.length > 0) {
            setBookingData(data[0]); // Assuming only one booking is allowed at a time
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

  const getEndTime = (startTime) => {
    const [hours, minutes, seconds] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, seconds || 0);
    startDate.setHours(startDate.getHours() + 1); // Add one hour to start time
    return startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
                  <p>{formatTime(bookingData.Time)}</p>
                </div>
                <div className="col-4 text-start">
                  <p className="mb-1" style={{ fontWeight: 500 }}>
                    End
                  </p>
                  <p>{getEndTime(bookingData.Time)}</p>
                </div>
                <div className="col-4 text-start">
                  <p className="mb-1" style={{ fontWeight: 500 }}>
                    Coach
                  </p>
                  <p>Josh Tan</p>
                </div>
              </div>
              <p className="text-start" style={{ color: "#555" }}>
                <strong>Status:</strong> You can join the meeting now.
              </p>

              <div className="d-flex justify-content-start mt-3">
                <button
                  className="btn btn-warning me-3 px-4 join-button"
                  style={{ fontWeight: 500 }}
                  onClick={handleNavigateToCoaching} // Call the navigation function
                >
                  Let's go!
                </button>
                <button
                  className="btn btn-outline-secondary px-4 cancel-button"
                  style={{ fontWeight: 500 }}
                >
                  Cancel
                </button>
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
        // No Bookings Message
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
    </div>
  );
}

export default Precoaching;
