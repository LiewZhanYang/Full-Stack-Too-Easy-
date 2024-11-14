import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdminEditWebinar = () => {
  const { id } = useParams(); // Get webinar ID if editing an existing webinar
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch existing webinar details if ID is present
      const fetchWebinarDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/webinar/${id}`
          );
          const data = response.data[0];
          setName(data.WebinarName);
          setDescription(data.WebinarDesc);
          setLink(data.Link);
          setDate(new Date(data.Date).toISOString().split("T")[0]); // Convert date for input[type="date"]
          setStartTime(data.StartTime);
          setEndTime(data.EndTime);
          setSpeaker(data.Speaker);
        } catch (error) {
          console.error("Error fetching webinar details:", error);
        }
      };
      fetchWebinarDetails();
    }
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("WebinarName", name);
    formData.append("WebinarDesc", description);
    formData.append("Link", link);
    formData.append("Date", date);
    formData.append("StartTime", startTime);
    formData.append("EndTime", endTime);
    formData.append("Speaker", speaker);
    if (selectedFile) {
      formData.append("file", selectedFile); // Append file if available
    }

    try {
      if (id) {
        // Update existing webinar
        await axios.put(`http://localhost:8000/webinar/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Webinar updated successfully!");
      } else {
        // Create new webinar
        await axios.post(`http://localhost:8000/webinar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Webinar created successfully!");
      }
      navigate("/admin-view-webinar"); // Redirect after submission
    } catch (error) {
      console.error("Error submitting webinar:", error);
      alert("Failed to submit webinar.");
    }
  };

  const handleCancel = () => {
    navigate("/admin-view-webinar");
  };

  return (
    <Container className="p-4">
      <h2>{id ? "Edit Webinar" : "Create Webinar"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="webinarName" className="mb-3">
          <Form.Label>Webinar Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter webinar name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="webinarImage" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group controlId="webinarDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter webinar description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="webinarLink" className="mb-3">
          <Form.Label>Webinar Link</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter webinar link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="webinarDate" className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="webinarStartTime" className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="webinarEndTime" className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="webinarSpeaker" className="mb-3">
          <Form.Label>Speaker</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter speaker's name"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mt-4">
          <Button variant="primary" type="submit" className="me-3">
            {id ? "Update Webinar" : "Create Webinar"}
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminEditWebinar;
