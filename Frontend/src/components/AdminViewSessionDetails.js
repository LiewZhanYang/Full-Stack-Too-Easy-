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

    const fetchChildrenWithCustomerInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/children/session/${sessionID}`
        );
        if (!response.ok) throw new Error("Failed to fetch children");

        const childrenData = await response.json();

        // Fetch customer information for each child
        const childrenWithCustomerInfo = await Promise.all(
          childrenData.map(async (child) => {
            try {
              const customerResponse = await fetch(
                `http://localhost:8000/children/customer-by-child/${child.ChildID}`
              );
              const customerData = await customerResponse.json();

              return {
                ...child,
                customerName: customerData.Name,
                customerContact: customerData.ContactNo,
              };
            } catch (error) {
              console.error(
                `Failed to fetch customer info for ChildID ${child.ChildID}:`,
                error
              );
              return { ...child, customerName: "N/A", customerContact: "N/A" };
            }
          })
        );

        setChildren(childrenWithCustomerInfo);
      } catch (error) {
        console.error(
          "Error fetching children with customer information:",
          error
        );
      }
    };

    fetchSessionDetails();
    fetchChildrenWithCustomerInfo();
  }, [sessionID]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };
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
          <Button
            variant="secondary"
            className="back-button"
            onClick={handleBackClick}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontWeight: "500",
              fontSize: "16px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            <FaArrowLeft style={{ marginRight: "8px" }} /> Back
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
        <h2 className="page-title">Child Details</h2>
      </Col>
      <hr className="divider-line mb-4" />
      {children.length > 0 ? (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Child's Name</th>
              <th>Date of Birth</th>
              <th>Age</th>
              <th>Strength</th>
              <th>Parent's Name</th>
              <th>Parent's Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child, index) => (
              <tr key={child.ChildID}>
                <td>{index + 1}</td>
                <td>{child.Name}</td>
                <td>{formatDate(child.DOB)}</td>
                <td>{child.Age}</td>
                <td>{child.Strength}</td>
                <td>{child.customerName}</td>
                <td>{child.customerContact}</td>
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
