import React, { useState } from 'react';
import { Container, Button, Form, InputGroup } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminEditTiming = () => {
  const [availability, setAvailability] = useState([
    { id: 1, date: null, timings: [{ id: 1, startTime: '' }] },
  ]);

  const handleAddDay = () => {
    setAvailability([
      ...availability,
      { id: availability.length + 1, date: null, timings: [{ id: 1, startTime: '' }] },
    ]);
  };

  const handleDateChange = (index, date) => {
    const updatedAvailability = availability.map((entry, idx) =>
      idx === index ? { ...entry, date } : entry
    );
    setAvailability(updatedAvailability);
  };

  const handleAddTiming = (dayIndex) => {
    const updatedAvailability = availability.map((entry, idx) =>
      idx === dayIndex
        ? { ...entry, timings: [...entry.timings, { id: entry.timings.length + 1, startTime: '' }] }
        : entry
    );
    setAvailability(updatedAvailability);
  };

  const handleTimingChange = (dayIndex, timingIndex, value) => {
    const updatedAvailability = availability.map((entry, idx) =>
      idx === dayIndex
        ? {
            ...entry,
            timings: entry.timings.map((timing, tIdx) =>
              tIdx === timingIndex ? { ...timing, startTime: value } : timing
            ),
          }
        : entry
    );
    setAvailability(updatedAvailability);
  };

  const handleDeleteDay = (dayIndex) => {
    setAvailability(availability.filter((_, idx) => idx !== dayIndex));
  };

  const handleDeleteTiming = (dayIndex, timingIndex) => {
    const updatedAvailability = availability.map((entry, idx) =>
      idx === dayIndex
        ? { ...entry, timings: entry.timings.filter((_, tIdx) => tIdx !== timingIndex) }
        : entry
    );
    setAvailability(updatedAvailability);
  };

  return (
    <Container fluid className="admin-edit-timing-page p-4">
      <h2 className="admin-edit-timing-title">Edit Available Timings</h2>
      <hr className="admin-edit-timing-divider mb-4" />

      <Form>
        {availability.map((day, dayIndex) => (
          <div key={day.id} className="day-container mb-4">
            <InputGroup className="mb-2">
              <DatePicker
                selected={day.date}
                onChange={(date) => handleDateChange(dayIndex, date)}
                placeholderText="Select a date"
                className="form-control"
                dateFormat="MMMM d, yyyy"
              />
              <Button variant="outline-danger" onClick={() => handleDeleteDay(dayIndex)}>
                <FaTrash />
              </Button>
            </InputGroup>

            {day.timings.map((timing, timingIndex) => (
              <InputGroup className="mb-2" key={timing.id}>
                <Form.Control
                  type="time"
                  placeholder="Enter start time"
                  value={timing.startTime}
                  onChange={(e) => handleTimingChange(dayIndex, timingIndex, e.target.value)}
                />
                <Button
                  variant="outline-danger"
                  onClick={() => handleDeleteTiming(dayIndex, timingIndex)}
                >
                  <FaTrash />
                </Button>
              </InputGroup>
            ))}

            <Button
              variant="outline-secondary"
              onClick={() => handleAddTiming(dayIndex)}
              className="mb-3"
            >
              Add Timing Slot
            </Button>
          </div>
        ))}
        <Button variant="outline-primary" onClick={handleAddDay} className="mt-3">
          Add Day
        </Button>
      </Form>
    </Container>
  );
};

export default AdminEditTiming;
