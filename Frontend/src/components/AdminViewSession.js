import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const AdminViewSession = () => {
  const [sessions, setSessions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const navigate = useNavigate();
  const { id: programID } = useParams();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/session/${programID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [programID]);

  const handleEditClick = (sessionId) => {
    navigate(`/admin-edit-session/${sessionId}`);
  };

  const handleCreateSessionClick = () => {
    navigate(`/admin-create-session/${programID}`);
  };

  const handleDeleteClick = (sessionId) => {
    setSessionToDelete(sessionId);
    setShowDeleteModal(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:8000/session/${sessionToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete session");
      }
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.SessionID !== sessionToDelete)
      );
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error("Error deleting session:", error);
      alert(
        "Unable to delete session: there may be associated payments or other dependencies."
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Container fluid className="admin-edit-program-page p-4">
      <h2 className="page-title">Public Speaking Workshop - Sessions</h2>
      <hr className="divider-line mb-4" />

      <div className="session-container p-3">
        <Table borderless className="session-table mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.SessionID}>
                <td>{`${formatDate(session.StartDate)} - ${formatDate(
                  session.EndDate
                )}`}</td>
                <td>{session.Time}</td>
                <td>{session.Location}</td>
                <td className="text-end">
                  <Button
                    variant="link"
                    className="action-icon"
                    onClick={() => handleEditClick(session.SessionID)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="link"
                    className="action-icon"
                    onClick={() => handleDeleteClick(session.SessionID)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Button
        variant="warning"
        className="create-session-button mt-3"
        onClick={handleCreateSessionClick}
      >
        Create Session
      </Button>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this session?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteSession}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminViewSession;
