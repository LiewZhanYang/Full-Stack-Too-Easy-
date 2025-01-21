import React, { useState, useEffect } from "react";
import { Container, Button, Table, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const AdminViewSession = () => {
  const [sessions, setSessions] = useState([]);
  const [programName, setProgramName] = useState(""); // State for program name
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const navigate = useNavigate();
  const { id: programID } = useParams();

  // Fetch program details to get the program name
  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/program/${programID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch program details");
        }
        const programData = await response.json();
        setProgramName(programData.ProgramName); // Set the program name
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };

    fetchProgramDetails();
  }, [programID]);

  // Fetch sessions for the program
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

  const handleViewDetailsClick = (sessionId) => {
    navigate(`/admin-view-session-details/${sessionId}`);
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
        throw new Error(
          "Unable to delete session: there may be associated payments or other dependencies."
        );
      }
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.SessionID !== sessionToDelete)
      );
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error("Error deleting session:", error);
      setShowDeleteModal(false);
      setShowErrorModal(true);
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
      <h2 className="page-title">{programName} Sessions</h2>
      <hr className="divider-line mb-4" />

      {sessions.length > 0 ? (
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
                      onClick={() => handleViewDetailsClick(session.SessionID)}
                    >
                      <FaEye />
                    </Button>
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
      ) : (
        <p className="text-align-left mt-4">
          No sessions available for this program.
        </p>
      )}

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
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this session? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDeleteSession}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Error Deleting Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Unable to delete session. Session already has confirmed payments.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminViewSession;
