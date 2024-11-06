import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Dropdown,
} from "react-bootstrap";
import { FaSearch, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminViewProgram = () => {
  const navigate = useNavigate();

  const programs = [
    { id: 1, title: "Public Speaking Workshop", image: "/img/workshops.jpg" },
    { id: 2, title: "PSLE Power Up Camp", image: "/img/camps.jpg" },
    {
      id: 3,
      title: "Future Entrepreneurs Labs",
      image: "/img/entrepreneurs.jpg",
    },
  ];

  const handleEditClick = (programId) => {
    navigate(`/admin-view-session/${programId}`);
  };

  return (
    <Container fluid className="admin-program-page p-4">
      <h1 className="admin-program-title fw-bold">Programs</h1>

      {/* Search and Filter Section */}
      <div className="admin-program-controls d-flex align-items-center my-3">
        <Form.Control
          type="text"
          placeholder="Search for programmes"
          className="admin-program-search me-2"
          style={{ maxWidth: "700px" }}
        />
        <Button
          variant="outline-secondary"
          className="admin-program-search-button me-2"
        >
          <FaSearch />
        </Button>
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            id="dropdown-basic"
            className="admin-program-filter"
          >
            Type
          </Dropdown.Toggle>

          <Dropdown.Menu className="admin-program-dropdown-menu">
            <Dropdown.Item href="#/action-1">Workshop</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Camp</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Lab</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Program Cards */}
      <Row className="admin-program-cards-row">
        {programs.map((program) => (
          <Col
            md={4}
            key={program.id}
            className="admin-program-card-col mb-4 d-flex align-items-stretch"
          >
            <Card className="admin-program-card shadow-sm h-100">
              <div className="admin-program-card-image-container">
                <Card.Img
                  variant="top"
                  src={program.image}
                  alt={program.title}
                  className="admin-program-card-image"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title className="admin-program-card-title">
                  {program.title}
                </Card.Title>
                <Button
                  variant="warning"
                  className="admin-program-edit-button d-flex align-items-center"
                  onClick={() => handleEditClick(program.id)}
                >
                  <FaEdit className="me-1" /> <span>Edit</span>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminViewProgram;
