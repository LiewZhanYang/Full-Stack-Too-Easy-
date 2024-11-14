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
                {sessionDetails.StartDate} - {sessionDetails.EndDate}
              </p>
              <p>
                <strong>Time</strong>
                <br />
                {sessionDetails.Time}
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
        <h2 className="page-title">Child Details</h2>
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
              <th>Account ID</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child, index) => (
              <tr key={child.ChildID}>
                <td>{index + 1}</td>
                <td>{child.Name}</td>
                <td>{child.Strength}</td>
                <td>{new Date(child.DOB).toLocaleDateString()}</td>
                <td>{child.Age}</td>
                <td>{child.AccountID}</td>
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
