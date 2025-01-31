import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Camps = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("http://localhost:8000/program");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const filteredData = data.filter((program) => program.TypeID === 2);
        setWorkshops(filteredData);
        setFilteredWorkshops(filteredData);
        fetchProgramImages(filteredData);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      }
    };
    const fetchProgramImages = async (programs) => {
      try {
        const imagePromises = programs.map(async (program) => {
          try {
            const response = await fetch(
              `http://localhost:8000/program-pic/${program.ProgramID}`
            );
            if (!response.ok) {
              throw new Error(
                `Error fetching image for ProgramID ${program.ProgramID}`
              );
            }
            const data = await response.json();
            return { id: program.ProgramID, url: data.url };
          } catch (error) {
            console.error(
              `Error fetching image for ProgramID ${program.ProgramID}:`,
              error
            );
            return { id: program.ProgramID, url: "/img/default.jpg" }; // Default image on error
          }
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, { id, url }) => {
          acc[id] = url;
          return acc;
        }, {});

        setImageUrls(imageMap);
      } catch (error) {
        console.error("Error fetching program images:", error);
      }
    };
    fetchWorkshops();
  }, []);

  useEffect(() => {
    const filtered = workshops.filter((workshop) =>
      workshop.ProgramName
        ? workshop.ProgramName.toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
    setFilteredWorkshops(filtered);
  }, [searchTerm, workshops]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCardClick = (id) => {
    navigate(`/camps/${id}`);
  };

  return (
    <Container fluid className="admin-program-page p-4">
      <h2 className="precoaching-title">Camps</h2>
      <div className="admin-program-controls d-flex align-items-center my-3">
        <Form.Control
          type="text"
          placeholder="Search for camps"
          className="admin-program-search me-2"
          style={{ maxWidth: "700px" }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Row className="admin-program-cards-row">
        {filteredWorkshops.map((workshop) => (
          <Col
            md={4}
            key={workshop.ProgramID}
            className="admin-program-card-col mb-4 d-flex align-items-stretch"
          >
            <Card
              className="admin-program-card shadow-sm h-100"
              onClick={() => handleCardClick(workshop.ProgramID)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Added wrapper for consistent styling */}
              <div className="workshops-card-image-container">
                <Card.Img
                  variant="top"
                  src={imageUrls[workshop.ProgramID] || "/img/default.jpg"}
                  alt={workshop.ProgramName}
                  className="admin-program-card-image"
                  style={{ height: "220px", objectFit: "cover" }}
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title
                  className="workshops-card-title"
                  style={{
                    textAlign: "left",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                  }}
                >
                  {workshop.ProgramName}
                </Card.Title>
                <Card.Text
                  style={{
                    textAlign: "left",
                    fontSize: "1rem",
                    fontWeight: "normal",
                    color: "#6c757d",
                    marginTop: "0",
                  }}
                >
                  {workshop.ProgramDesc}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Camps;
