import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminViewSingleAnnouncement = () => {
  const { id } = useParams(); // Retrieve the announcement ID from the URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/announcement/${id}`
        );
        const announcement = response.data;
        console.log("Fetched announcement in frontend:", announcement); // Log fetched data

        // Set title and description if announcement is valid
        if (announcement) {
          setTitle(announcement.Title);
          setDescription(announcement.Body);
        } else {
          alert("Announcement not found");
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
        alert("There was an error fetching the announcement details.");
      }
    };

    fetchAnnouncement();
  }, [id]);
  
  const handleBack= () => {
    navigate(-1);
  };


  return (
    <Container fluid className="admin-view-single-announcement-page p-4">
      <h2 className="admin-create-title">View Announcement</h2>
      <hr className="admin-create-divider mb-4" />

      <Form>
        <Form.Group controlId="announcementTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            readOnly
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #ced4da",
              fontSize: "1rem",
              padding: "0.75rem",
            }}
          />
        </Form.Group>
        <Form.Group controlId="announcementDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={description}
            readOnly
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #ced4da",
              fontSize: "1rem",
              padding: "0.75rem",
            }}
          />
        </Form.Group>
        <div className="admin-create-button-group mt-4">
          <Button
            variant="warning"
            className="admin-create-confirm-button"
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminViewSingleAnnouncement;
