import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const AdminViewSessionDetails = () => {
  const { id: sessionID } = useParams();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  // Fetch session details on component load
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/session/sessionID/${sessionID}`
        );
        if (!response.ok) throw new Error("Failed to fetch session details");

        const data = await response.json();
        setSessionDetails(data);
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    const fetchChildren = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/children/session/${sessionID}`
        );
        if (!response.ok) throw new Error("Failed to fetch children");

        const data = await response.json();
        setChildren(data);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchSessionDetails();
    fetchChildren();
  }, [sessionID]);

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // Helper function to format dates to DD/MM/YYYY
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "en-GB" ensures DD/MM/YYYY format
  };

  // Helper function to format time to HH:MM AM/PM
  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Container fluid className="admin-view-session-details-page p-4">
      <Row className="mb-3">
        <Col>
          <h2 className="page-title">Session Details</h2>
        </Col>
        <Col className="text-end">
          <Button variant="link" onClick={handleBackClick}>
            <FaArrowLeft /> Back
          </Button>
        </Col>
      </Row>
      <hr className="divider-line mb-4" />

      {sessionDetails ? (
        <Row>
          <Col md={6}>
            <div className="admin-confirm-details">
              <p>
                <strong>Session ID</strong>
                <br />
                {sessionDetails.SessionID}
              </p>
              <p>
                <strong>Date</strong>
                <br />
                {formatDate(sessionDetails.StartDate)} -{" "}
                {formatDate(sessionDetails.EndDate)}
              </p>
              <p>
                <strong>Time</strong>
                <br />
                {formatTime(sessionDetails.Time)}
              </p>
              <p>
                <strong>Location</strong>
                <br />
                {sessionDetails.Location}
              </p>
              <p>
                <strong>Vacancy</strong>
                <br />
                {sessionDetails.Vacancy}
              </p>
            </div>
          </Col>
        </Row>
      ) : (
        <p>Loading session details...</p>
      )}
      <br />
      <Col>
        <h2 className="page-title">Attendee Details</h2>
      </Col>
      <hr className="divider-line mb-4" />
      {children.length > 0 ? (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Strength</th>
              <th>Date of Birth</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child, index) => (
              <tr key={child.ChildID}>
                <td>{index + 1}</td>
                <td>{child.Name}</td>
                <td>{child.Strength}</td>
                <td>{formatDate(child.DOB)}</td>
                <td>{child.Age}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="mt-4">No children registered for this session.</p>
      )}
    </Container>
  );
};

export default AdminViewSessionDetails;
