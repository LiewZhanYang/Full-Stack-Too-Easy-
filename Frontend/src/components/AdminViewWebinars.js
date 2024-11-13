import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaSearch, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminViewWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [filteredWebinars, setFilteredWebinars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await fetch("http://localhost:8000/webinar");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched webinars:", data);
        setWebinars(data);
        setFilteredWebinars(data);
      } catch (error) {
        console.error("Error fetching webinars:", error);
      }
    };

    fetchWebinars();
  }, []);

  useEffect(() => {
    const filtered = webinars.filter((webinar) =>
      webinar.WebinarName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWebinars(filtered);
  }, [searchTerm, webinars]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (webinarId) => {
    navigate(`/admin-edit-webinar/${webinarId}`);
  };

  const handleDeleteClick = async (webinarId) => {
    if (window.confirm("Are you sure you want to delete this webinar?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/webinar/${webinarId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          console.log("Webinar deleted successfully");
          setWebinars((prevWebinars) =>
            prevWebinars.filter((webinar) => webinar.WebinarID !== webinarId)
          );
          setFilteredWebinars((prevWebinars) =>
            prevWebinars.filter((webinar) => webinar.WebinarID !== webinarId)
          );
        } else {
          console.error("Failed to delete webinar");
        }
      } catch (error) {
        console.error("Error deleting webinar:", error);
      }
    }
  };

  const handleCreateWebinarClick = () => {
    navigate("/admin-create-webinar");
  };

  return (
    <Container fluid className="admin-webinar-page p-4">
      <h1 className="admin-webinar-title fw-bold">Webinars</h1>

      {/* Search Section */}
      <div className="admin-webinar-controls d-flex align-items-center my-3">
        <Form.Control
          type="text"
          placeholder="Search for webinars"
          className="admin-webinar-search me-2"
          style={{ maxWidth: "700px" }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button
          variant="outline-secondary"
          className="admin-webinar-search-button me-2"
          onClick={() => setSearchTerm("")}
        >
          <FaSearch />
        </Button>
      </div>

      {/* Webinar Cards */}
      <Row className="admin-webinar-cards-row">
        {filteredWebinars.map((webinar) => (
          <Col
            md={4}
            key={webinar.WebinarID}
            className="admin-webinar-card-col mb-4 d-flex align-items-stretch"
          >
            <Card className="admin-webinar-card shadow-sm h-100">
              <div className="admin-webinar-card-image-container">
                <Card.Img
                  variant="top"
                  src={webinar.image || "/img/default.jpg"}
                  alt={webinar.WebinarName}
                  className="admin-webinar-card-image"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title
                  className="admin-webinar-card-title"
                  style={{ textAlign: "left" }}
                >
                  {webinar.WebinarName}
                </Card.Title>
                <Card.Text style={{ textAlign: "left" }}>
                  Speaker: {webinar.Speaker}
                </Card.Text>
                <Card.Text style={{ textAlign: "left" }}>
                  Date: {new Date(webinar.Date).toLocaleDateString()}
                </Card.Text>
                <div className="d-flex gap-2 mt-auto">
                  <Button
                    variant="warning"
                    className="admin-webinar-edit-button d-flex align-items-center"
                    onClick={() => handleEditClick(webinar.WebinarID)}
                  >
                    <FaEdit className="me-1" /> <span>Edit</span>
                  </Button>
                  <Button
                    variant="danger"
                    className="admin-webinar-delete-button d-flex align-items-center"
                    onClick={() => handleDeleteClick(webinar.WebinarID)}
                  >
                    <FaTrash className="me-1" /> <span>Delete</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Webinar Button (Bottom Right) */}
      <Button
        variant="success"
        className="admin-create-webinar-button d-flex align-items-center"
        onClick={handleCreateWebinarClick}
      >
        <FaPlus className="me-1" /> <span>Create Webinar</span>
      </Button>
    </Container>
  );
};

export default AdminViewWebinars;
