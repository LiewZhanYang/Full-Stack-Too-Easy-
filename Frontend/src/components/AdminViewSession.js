import React, { useState, useEffect } from "react";
import { Container, Button, Table, Row, Col, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminViewSession = () => {
  const [tiers, setTiers] = useState([]);
  const [programName, setProgramName] = useState("");
  const [errorModal, setErrorModal] = useState(false); // State for error modal
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [confirmDelete, setConfirmDelete] = useState(false); // State for delete confirmation
  const [sessionToDelete, setSessionToDelete] = useState(null); // Session ID to delete
  const navigate = useNavigate();
  const { id: programID } = useParams();

  // Fetch program details
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
        setProgramName(programData.ProgramName);
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };

    fetchProgramDetails();
  }, [programID]);

  // Fetch tiers and their sessions
  useEffect(() => {
    const fetchTiersAndSessions = async () => {
      try {
        const tierResponse = await fetch(
          `http://localhost:8000/tier/${programID}`
        );
        if (!tierResponse.ok) {
          throw new Error("Failed to fetch tiers");
        }
        const tierData = await tierResponse.json();

        const tiersWithSessions = await Promise.all(
          tierData.map(async (tier, index) => {
            const sessionResponse = await fetch(
              `http://localhost:8000/session/${tier.TierID}`
            );
            const sessions = sessionResponse.ok
              ? await sessionResponse.json()
              : [];
            return { ...tier, sessions, tierNumber: index + 1 };
          })
        );

        setTiers(tiersWithSessions);
      } catch (error) {
        console.error("Error fetching tiers and sessions:", error);
      }
    };

    fetchTiersAndSessions();
  }, [programID]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCreateSessionClick = (tierID) => {
    navigate(`/admin-create-session/${tierID}`);
  };

  const handleEditSessionClick = (sessionID) => {
    navigate(`/admin-edit-session/${sessionID}`);
  };

  const handleViewSessionClick = (sessionID) => {
    navigate(`/admin-view-session-details/${sessionID}`);
  };

  const handleConfirmDelete = (sessionID) => {
    setSessionToDelete(sessionID); // Store the session ID for deletion
    setConfirmDelete(true); // Open confirmation modal
  };

  const handleDeleteSession = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/session/${sessionToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete session");
      }

      // Refresh tiers and sessions after deletion
      setTiers((prevTiers) =>
        prevTiers.map((tier) => ({
          ...tier,
          sessions: tier.sessions.filter(
            (session) => session.SessionID !== sessionToDelete
          ),
        }))
      );

      setConfirmDelete(false); // Close confirmation modal
      alert("Session deleted successfully!");
    } catch (error) {
      console.error("Error deleting session:", error);
      setErrorMessage(
        error.message.includes("foreign key")
          ? "Payments have already been made, and the session cannot be deleted."
          : "Unable to delete session, payments have already been made."
      );
      setConfirmDelete(false); // Close confirmation modal
      setErrorModal(true); // Open error modal
    }
  };

  return (
    <Container fluid className="admin-view-session-page p-4">
      <h2 className="page-title">{programName} - Tiers and Sessions</h2>
      <hr className="divider-line mb-4" />

      {tiers.length > 0 ? (
        tiers.map((tier) => (
          <div
            key={tier.TierID}
            className="tier-section mb-4 p-4 rounded"
            style={{
              border: "1px solid #ddd",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row className="align-items-center mb-3">
              <Col>
                <h4>
                  Tier {tier.tierNumber}: {tier.Name}
                </h4>
              </Col>
              <Col className="text-end">
                <Button
                  variant="warning"
                  onClick={() => handleCreateSessionClick(tier.TierID)}
                >
                  Create Session
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <strong>Cost:</strong> ${tier.Cost}
                </p>
                <p>
                  <strong>Class Size:</strong> {tier.ClassSize}
                </p>
                <p>
                  <strong>Duration:</strong> {tier.Duration} days
                </p>
                <p>
                  <strong>Lunch Provided:</strong>{" "}
                  {tier.LunchProvided ? "Yes" : "No"}
                </p>
              </Col>
            </Row>
            {tier.sessions.length > 0 ? (
              <div className="session-container mt-3">
                <Table className="mb-0" borderless hover>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tier.sessions.map((session, index) => (
                      <tr key={session.SessionID}>
                        <td>{index + 1}</td>
                        <td>
                          {formatDate(session.StartDate)} -{" "}
                          {formatDate(session.EndDate)}
                        </td>
                        <td>{session.Time}</td>
                        <td>{session.Location}</td>
                        <td className="text-end">
                          <Button
                            variant="link"
                            onClick={() =>
                              handleViewSessionClick(session.SessionID)
                            }
                          >
                            View
                          </Button>
                          <Button
                            variant="link"
                            onClick={() =>
                              handleEditSessionClick(session.SessionID)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="link"
                            className="text-danger"
                            onClick={() =>
                              handleConfirmDelete(session.SessionID)
                            }
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p>
                <br></br>No sessions available for this tier.
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No tiers available for this program.</p>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={confirmDelete}
        onHide={() => setConfirmDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this session? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteSession}>
            Confirm Delete
          </Button>
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={errorModal} onHide={() => setErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminViewSession;
