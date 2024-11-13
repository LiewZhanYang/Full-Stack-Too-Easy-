import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditWebinar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchWebinarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/webinar/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const webinar = data[0];
        console.log("Fetched webinar data:", webinar);

        let formattedDate = webinar.Date.split("T")[0];
        let date = new Date(formattedDate);
        date.setDate(date.getDate() + 1);
        formattedDate = date.toISOString().split("T")[0];

        console.log("Adjusted date:", formattedDate);

        setName(webinar.WebinarName);
        setDescription(webinar.WebinarDesc);
        setLink(webinar.Link);
        setDate(formattedDate);
        setStartTime(webinar.StartTime);
        setEndTime(webinar.EndTime);
        setSpeaker(webinar.Speaker);
        setImage(webinar.Image);
      } catch (error) {
        console.error("Error fetching webinar details:", error);
      }
    };

    fetchWebinarDetails();
  }, [id]);

  const handleUpdateWebinar = async () => {
    const updatedWebinarDetails = {
      WebinarName: name,
      WebinarDesc: description,
      Link: link,
      Date: date,
      StartTime: startTime,
      EndTime: endTime,
      Speaker: speaker,
      Image: image,
    };

    console.log("Updating webinar with data:", updatedWebinarDetails);

    try {
      const response = await fetch(`http://localhost:8000/webinar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWebinarDetails),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Webinar updated successfully:", result);
        navigate("/admin-view-webinar");
      } else {
        console.error("Failed to update webinar");
      }
    } catch (error) {
      console.error("Error updating webinar:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin-view-webinar");
  };

  return (
    <Container fluid className="admin-edit-webinar-page p-4">
      <h2 className="admin-create-title">Edit Webinar</h2>
      <hr className="admin-create-divider mb-4" />

      <Form>
        <Form.Group controlId="webinarName" className="mb-3">
          <Form.Label>Webinar Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter webinar name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="webinarImage" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" accept="image/*" />
          {image && (
            <div className="image-preview mt-3">
              <img
                src={image}
                alt="Webinar Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="webinarDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter webinar description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="webinarLink" className="mb-3">
          <Form.Label>Webinar Link</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter webinar link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="webinarDate" className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="webinarStartTime" className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="webinarEndTime" className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="webinarSpeaker" className="mb-3">
          <Form.Label>Speaker</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter speaker's name"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
          />
        </Form.Group>

        <div className="admin-create-button-group mt-4">
          <Button
            variant="warning"
            className="me-3 px-4"
            onClick={handleUpdateWebinar}
          >
            Update Webinar
          </Button>
          <Button variant="danger" className="px-4" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminEditWebinar;
