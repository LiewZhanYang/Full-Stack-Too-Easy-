import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isBefore,
  isSameDay,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Container, Row, Col, Button, ListGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const timeSlots = [
  { label: "09:00-10:00", start: "09:00:00", end: "10:00:00" },
  { label: "11:00-12:00", start: "11:00:00", end: "12:00:00" },
  { label: "13:00-14:00", start: "13:00:00", end: "14:00:00" },
  { label: "15:00-16:00", start: "15:00:00", end: "16:00:00" },
  { label: "17:00-18:00", start: "17:00:00", end: "18:00:00" },
];

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:8000/booking/");
        const data = await response.json();
        console.log("All Bookings:", data);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    if (slotInfo.start < today || isDayFullyBooked(slotInfo.start)) return;
    setSelectedSlot(slotInfo.start);
    setSelectedDate(slotInfo.start);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot.label);
  };

  const handleConfirmBooking = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/precoaching");
  };

  const handleNavigate = (date) => {
    if (
      date.getFullYear() < today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() &&
        date.getMonth() < today.getMonth())
    ) {
      setCurrentDate(today);
    } else {
      setCurrentDate(date);
    }
  };

  const isTimeSlotBooked = (timeSlot) => {
    return bookings.some(
      (booking) =>
        new Date(booking.Date).toDateString() === selectedSlot.toDateString() &&
        booking.Time === timeSlot.start
    );
  };

  const isDayFullyBooked = (date) => {
    const dayBookings = bookings.filter(
      (booking) => new Date(booking.Date).toDateString() === date.toDateString()
    );
    return dayBookings.length === timeSlots.length;
  };

  const dayPropGetter = (date) => {
    const isPast = isBefore(date, today);
    const isSameDayAsToday = isSameDay(date, today);
    const isFullyBooked = isDayFullyBooked(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    let tooltipMessage = "";

    if (isPast) {
      tooltipMessage = "No bookings can be made before today's date.";
    } else if (isSameDayAsToday) {
      tooltipMessage = "Booking cannot be made on the same day as coaching.";
    } else if (isFullyBooked) {
      tooltipMessage = "This date is fully booked.";
    }

    return {
      className: `calendar-day ${
        isPast || isFullyBooked ? "greyed-out-day" : "hoverable-day"
      } ${isSelected ? "selected-day" : ""}`,
      style:
        isFullyBooked || isPast || isSameDayAsToday
          ? { pointerEvents: "none" }
          : {},
      title: tooltipMessage,
    };
  };

  return (
    <Container className="booking-container p-4">
      <Row>
        <Col md={8}>
          <h2 className="booking-title">Schedule a 1 to 1 coaching session</h2>
          <Calendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onNavigate={handleNavigate}
            date={currentDate}
            style={{
              height: 600,
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
            views={["month"]}
            min={today}
            dayPropGetter={dayPropGetter}
          />
        </Col>

        <Col md={3} className="time-slot-section">
          <h4 className="time-slot-title">Select a time slot:</h4>
          <ListGroup className="mb-3">
            {selectedSlot ? (
              <ListGroup.Item className="selected-time">
                Selected Time: {format(selectedSlot, "MMMM do, yyyy")}{" "}
                {selectedTimeSlot ? `- ${selectedTimeSlot}` : ""}
              </ListGroup.Item>
            ) : (
              <ListGroup.Item className="no-selection">
                Select a slot on the calendar
              </ListGroup.Item>
            )}
          </ListGroup>

          {timeSlots.map((timeSlot, index) => (
            <Button
              key={index}
              variant={
                selectedTimeSlot === timeSlot.label
                  ? "primary"
                  : "outline-secondary"
              }
              className={`time-slot-button mb-2 w-100 ${
                selectedTimeSlot === timeSlot.label ? "selected-time-slot" : ""
              }`}
              onClick={() => handleTimeSlotClick(timeSlot)}
              disabled={!selectedSlot || isTimeSlotBooked(timeSlot)}
            >
              {timeSlot.label}
            </Button>
          ))}

          <Button
            variant="warning"
            className="confirm-button w-100 mb-2"
            disabled={!selectedTimeSlot || !selectedSlot}
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </Button>
          <Button variant="secondary" className="back-button w-100">
            Back
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Confirmed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your booking for {format(selectedSlot, "MMMM do, yyyy")} at{" "}
          {selectedTimeSlot} has been confirmed.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseModal}
            style={{ backgroundColor: "#DCAF27", borderColor: "#DCAF27" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Booking;
