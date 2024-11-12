import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const AdminViewSession = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const { id: programID } = useParams(); 

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/session/${programID}`);
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

  const handleDeleteClick = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:8000/session/${sessionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete session");
      }
      setSessions((prevSessions) => prevSessions.filter((session) => session.SessionID !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
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
                <td>{`${formatDate(session.StartDate)} - ${formatDate(session.EndDate)}`}</td>
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
    </Container>
  );
};

export default AdminViewSession;
