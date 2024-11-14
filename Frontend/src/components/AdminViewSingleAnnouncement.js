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
    // Fetch the announcement details
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/announcement/${id}`
        );
        const announcement = response.data;

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

  const handleBack = () => {
    navigate("/admin-view-announcement");
  };

  return (
    <Container
      fluid
      className="admin-view-single-announcement-page p-4"
      style={{ maxWidth: "600px" }}
    >
      <h2 className="admin-view-title">View Announcement</h2>
      <hr className="admin-view-divider mb-4" />
      <Form>
        <Form.Group controlId="announcementTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} readOnly />
        </Form.Group>
        <Form.Group controlId="announcementDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={6} value={description} readOnly />
        </Form.Group>
        <div className="d-flex justify-content-center mt-4">
          <Button variant="warning" onClick={handleBack}>
            Back
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminViewSingleAnnouncement;
