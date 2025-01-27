import React, { useState, useEffect } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdminEditAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the announcement ID from the URL

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/announcement/${id}`
        );
        const announcement = response.data;

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
        setShowSuccessModal(true); // Show success modal on successful update
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
    <Container fluid className="admin-edit-announcement-page p-4">
      <h2 className="admin-create-title">Edit Announcement</h2>
      <hr className="admin-edit-divider mb-4" />

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirmModal(true); // Show confirmation modal
        }}
      >
        <Form.Group controlId="announcementTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
            required
          />
        </Form.Group>

        <div className="mt-4">
          <Button
            variant="warning"
            type="submit"
            className="me-3"
            style={{
              backgroundColor: "#fbbf24",
              color: "black",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update this announcement?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            style={{
              backgroundColor: "#fbbf24",
              color: "black",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
            onClick={() => {
              setShowConfirmModal(false);
              handleUpdateAnnouncement();
            }}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false);
          navigate("/admin-view-announcement");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Announcement Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>The announcement has been updated successfully.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            style={{
              backgroundColor: "#fbbf24",
              color: "black",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/admin-view-announcement");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminEditAnnouncement;
