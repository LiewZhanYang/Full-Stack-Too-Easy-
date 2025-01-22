import React, { useState, useEffect } from "react";
import { Container, Button, Table, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminViewSession = () => {
  const [tiers, setTiers] = useState([]);
  const [programName, setProgramName] = useState("");
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
                      <th>No.</th> {/* Add column header for session number */}
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tier.sessions.map(
                      (
                        session,
                        index // Use map's index parameter for session numbering
                      ) => (
                        <tr key={session.SessionID}>
                          <td>{index + 1}</td> {/* Display session number */}
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
                          </td>
                        </tr>
                      )
                    )}
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
    </Container>
  );
};

export default AdminViewSession;
