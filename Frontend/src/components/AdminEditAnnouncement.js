import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdminEditAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get the announcement ID from the URL

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/announcement/${id}`
        );
        const announcement = response.data;

        // Check if the response contains the expected data structure
        if (announcement && announcement.AnnouncementID === parseInt(id)) {
          setTitle(announcement.Title);
          setDescription(announcement.Body);
        } else {
          alert("Announcement not found or ID mismatch");
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
        alert("There was an error fetching the announcement details.");
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleUpdateAnnouncement = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/announcement/${id}`,
        {
          Title: title,
          Body: description,
        }
      );

      if (response.status === 200) {
        console.log("Announcement Updated:", response.data);
        navigate("/admin-view-announcement"); // Redirect to the announcement list after updating
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
      alert("There was an error updating the announcement. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/admin-view-announcement");
  };

  return (
    <Container
      fluid
      className="admin-edit-announcement-page p-4"
      style={{ maxWidth: "600px" }}
    >
      <h2 className="admin-edit-title">Edit Announcement</h2>
      <hr className="admin-edit-divider mb-4" />
      <Form>
        <Form.Group controlId="announcementTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="announcementDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Enter announcement description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="primary"
            className="me-3"
            onClick={handleUpdateAnnouncement}
          >
            Save Changes
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminEditAnnouncement;
