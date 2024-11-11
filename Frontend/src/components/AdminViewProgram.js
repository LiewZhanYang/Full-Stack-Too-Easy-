import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Dropdown,
} from "react-bootstrap";
import { FaSearch, FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminViewProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const navigate = useNavigate();

  const typeMapping = {
    All: null,
    Workshop: 1,
    Camps: 2,
    Labs: 3,
    Professional: 4,
    Webinar: 5,
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:8000/program");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched programs:", data);
        setPrograms(data);
        setFilteredPrograms(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const filtered = programs.filter((program) => {
      const matchesSearchTerm = program.ProgrameName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All" || program.TypeID === typeMapping[selectedType];
      return matchesSearchTerm && matchesType;
    });

    console.log("Filtered programs:", filtered);
    setFilteredPrograms(filtered);
  }, [searchTerm, selectedType, programs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleEditClick = (programId) => {
    navigate(`/admin-view-session/${programId}`);
  };

  const handleCreateProgramClick = () => {
    navigate("/admin-create-program");
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
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button
          variant="outline-secondary"
          className="admin-program-search-button me-2"
          onClick={() => setSearchTerm("")} 
        >
          <FaSearch />
        </Button>
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            id="dropdown-basic"
            className="admin-program-filter"
          >
            {selectedType}
          </Dropdown.Toggle>
          <Dropdown.Menu className="admin-program-dropdown-menu">
            <Dropdown.Item onClick={() => handleTypeSelect("All")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("Workshop")}>Workshop</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("Camps")}>Camps</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("Labs")}>Labs</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("Professional")}>Professional</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("Webinar")}>Webinar</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Program Cards */}
      <Row className="admin-program-cards-row">
        {filteredPrograms.map((program) => (
          <Col
            md={4}
            key={program.ProgramID}
            className="admin-program-card-col mb-4 d-flex align-items-stretch"
          >
            <Card className="admin-program-card shadow-sm h-100">
              <div className="admin-program-card-image-container">
                <Card.Img
                  variant="top"
                  src={program.image || "/img/default.jpg"}
                  alt={program.ProgrameName}
                  className="admin-program-card-image"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title className="admin-program-card-title" style={{ textAlign: "left" }}>
                  {program.ProgrameName} 
                </Card.Title>
                <Card.Text style={{ textAlign: "left" }}>
                  Cost: ${program.Cost}
                </Card.Text>
                <Button
                  variant="warning"
                  className="admin-program-edit-button d-flex align-items-center"
                  onClick={() => handleEditClick(program.ProgramID)}
                >
                  <FaEdit className="me-1" /> <span>Edit</span>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Program Button */}
      <Button
        variant="success"
        className="admin-create-program-button d-flex align-items-center"
        onClick={handleCreateProgramClick}
      >
        <FaPlus className="me-1" /> <span>Create Programme</span>
      </Button>
    </Container>
  );
};

export default AdminViewProgram;
