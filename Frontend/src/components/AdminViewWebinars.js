import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminViewWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [filteredWebinars, setFilteredWebinars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [webinarToDelete, setWebinarToDelete] = useState(null);
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await fetch("http://localhost:8000/webinar");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setWebinars(data);
        setFilteredWebinars(data);
      } catch (error) {
        console.error("Error fetching webinars:", error);
      }
    };
    fetchWebinars();
  }, []);
  useEffect(() => {
    if (webinars.length > 0) {
      const fetchWebinarImages = async () => {
        try {
          const imagePromises = webinars.map(async (webinar) => {
            try {
              const response = await fetch(
                `http://localhost:8000/webinar-pic/${webinar.WebinarID}`
              );
              if (!response.ok) {
                throw new Error(
                  `Error fetching image for WebinarID ${webinar.WebinarID}`
                );
              }
              const data = await response.json();

              console.log(
                `✅ Webinar ${webinar.WebinarID} Image URL:`,
                data.url
              ); // Debugging

              return { id: webinar.WebinarID, url: data.url };
            } catch (error) {
              console.error(
                `❌ Error fetching image for WebinarID ${webinar.WebinarID}:`,
                error
              );
              return { id: webinar.WebinarID, url: "/img/default.jpg" };
            }
          });

          const imageResults = await Promise.all(imagePromises);
          console.log("Final Image URLs in React State:", imageResults); // Debugging

          const imageMap = imageResults.reduce((acc, { id, url }) => {
            acc[id] = url;
            return acc;
          }, {});

          setImageUrls(imageMap);
        } catch (error) {
          console.error("❌ Error fetching webinar images:", error);
        }
      };

      fetchWebinarImages();
    }
  }, [webinars]);

  useEffect(() => {
    const filtered = webinars.filter((webinar) =>
      webinar.WebinarName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWebinars(filtered);
  }, [searchTerm, webinars]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetailsClick = (webinarId) => {
    navigate(`/admin-view-webinar-details/${webinarId}`);
  };

  const handleDeleteClick = (webinarId) => {
    setWebinarToDelete(webinarId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (webinarToDelete) {
      try {
        const response = await fetch(
          `http://localhost:8000/webinar/${webinarToDelete}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setWebinars((prevWebinars) =>
            prevWebinars.filter(
              (webinar) => webinar.WebinarID !== webinarToDelete
            )
          );
          setFilteredWebinars((prevWebinars) =>
            prevWebinars.filter(
              (webinar) => webinar.WebinarID !== webinarToDelete
            )
          );
          setShowConfirmModal(false);
          setWebinarToDelete(null);
        } else {
          console.error("Failed to delete webinar");
        }
      } catch (error) {
        console.error("Error deleting webinar:", error);
      }
    }
  };

  return (
    <Container fluid className="admin-program-page p-4">
      <h2 className="precoaching-title">Webinars</h2>

      {/* Search Section */}
      <div className="admin-program-controls d-flex align-items-center my-3">
        <Form.Control
          type="text"
          placeholder="Search for webinars"
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
      </div>

      {/* Webinar Cards */}
      {filteredWebinars.length === 0 ? (
        <p>
          <br></br>No webinars currently.
        </p>
      ) : (
        <Row className="admin-program-cards-row">
          {filteredWebinars.map((webinar) => (
            <Col
              md={4}
              key={webinar.WebinarID}
              className="admin-program-card-col mb-4 d-flex align-items-stretch"
            >
              <Card className="admin-program-card shadow-sm h-100">
                <div className="admin-program-card-image-container">
                  <Card.Img
                    variant="top"
                    src={imageUrls[webinar.WebinarID] || "/img/default.jpg"}
                    alt={webinar.WebinarName}
                    className="admin-program-card-image"
                    onLoad={() =>
                      console.log(
                        `✅ Image Loaded: ${imageUrls[webinar.WebinarID]}`
                      )
                    }
                    onError={(e) => {
                      console.error(`❌ Image Load Failed: ${e.target.src}`);
                      e.target.src = "/img/default.jpg";
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title
                    className="admin-program-card-title"
                    style={{
                      textAlign: "left",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    {webinar.WebinarName}
                  </Card.Title>
                  <Card.Text
                    style={{
                      textAlign: "left",
                      fontSize: "1rem",
                      color: "#6c757d",
                    }}
                  >
                    Speaker: {webinar.Speaker}
                  </Card.Text>
                  <Card.Text
                    style={{
                      textAlign: "left",
                      fontSize: "1rem",
                      color: "#6c757d",
                    }}
                  >
                    Date: {new Date(webinar.Date).toLocaleDateString()}
                  </Card.Text>
                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      variant="warning"
                      className="admin-program-edit-button d-flex align-items-center"
                      style={{
                        backgroundColor: "#fbbf24",
                        color: "black",
                      }}
                      onClick={() => handleViewDetailsClick(webinar.WebinarID)}
                    >
                      <FaEye className="me-1" /> <span>View Details</span>
                    </Button>
                    <Button
                      variant="danger"
                      className="admin-program-edit-button d-flex align-items-center"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                      }}
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
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this webinar?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              borderRadius: "8px",
              padding: "8px 16px",
              fontWeight: "500",
            }}
            onClick={confirmDelete}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminViewWebinars;
