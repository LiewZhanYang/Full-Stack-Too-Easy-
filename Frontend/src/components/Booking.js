import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isBefore } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";

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
  "11:30-12:30",
  "13:00-14:00",
  "15:00-15:30",
  "16:00-16:30",
  "18:30-19:30",
  "21:00-21:30",
];

function Booking() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const handleSelectSlot = (slotInfo) => {
    if (slotInfo.start < today) {
      return;
    }
    setSelectedSlot(slotInfo.start);
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleNavigate = (date, view) => {
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

  const dayPropGetter = (date) => {
    const isPast = isBefore(date, today);
    return {
      className: `calendar-day ${isPast ? "greyed-out-day" : "hoverable-day"}`,
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
                Selected Time: {format(selectedSlot, "HH:mm - MMMM do, yyyy")}
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
                selectedTimeSlot === timeSlot ? "primary" : "outline-secondary"
              }
              className="time-slot-button mb-2 w-100"
              onClick={() => handleTimeSlotClick(timeSlot)}
            >
              {timeSlot}
            </Button>
          ))}

          <Button
            variant="warning"
            className="confirm-button w-100 mb-2"
            disabled={!selectedTimeSlot}
          >
            Confirm Booking
          </Button>
          <Button variant="secondary" className="back-button w-100">
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Booking;
