import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

function Workshopvm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = location.state;
  const [workshopDetails, setWorkshopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      try {
        console.log("Fetching session details for sessionId:", sessionId);
        const sessionResponse = await axios.get(
          `http://localhost:8000/session/SessionID/${sessionId}`
        );
        console.log("Session response:", sessionResponse.data);
        const sessionData = sessionResponse.data;

        if (!sessionData) {
          setError("Session details not found for this ID.");
          return;
        }

        let tierDetails = null;
        let programDetails = null;

        if (sessionData.TierID) {
          console.log("Fetching tier details for TierID:", sessionData.TierID);
          const tierResponse = await axios.get(
            `http://localhost:8000/tier/${sessionData.TierID}`
          );
          console.log("Tier response:", tierResponse.data);
          tierDetails = tierResponse.data;
        }

        console.log("Fetching program details for SessionID:", sessionId);
        const programResponse = await axios.get(
          `http://localhost:8000/program/session/${sessionId}`
        );
        console.log("Program response:", programResponse.data);
        programDetails = programResponse.data[0];

        setWorkshopDetails({
          session: sessionData,
          tier: tierDetails,
          program: programDetails,
        });
      } catch (err) {
        console.error("Failed to fetch workshop details:", err);
        setError("Failed to load workshop details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [sessionId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!workshopDetails) {
    return <p>No details available for this workshop.</p>;
  }

  const { session, tier, program } = workshopDetails;

  const handleArrangeMakeupSession = () => {
    console.log("Navigating to SubmitMc with state:", {
      session,
      program,
      tier: tier?.[0] || {}, 
    });

    navigate(`/submitmc/${session.SessionID}`, {
      state: { session, program, tier: tier?.[0] || {} },
    });
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#fbbf24",
          color: "white",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        Back
      </button>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}
        >
          {program?.ProgramName || "Unknown Program"} -{" "}
          {tier?.[0]?.Name || "Unknown Tier"}
        </h1>
        <p style={{ marginBottom: "4px", color: "#666" }}>
          Duration: {new Date(session?.StartDate).toLocaleDateString()} -{" "}
          {new Date(session?.EndDate).toLocaleDateString()}
        </p>
        <p style={{ marginBottom: "4px", color: "#666" }}>
          Time: {session?.Time || "TBD"}
        </p>
        <p style={{ marginBottom: "4px", color: "#666" }}>
          Location: {session?.Location || "TBD"}
        </p>
        <p style={{ marginTop: "16px", color: "#333" }}>
          {session?.Description || "No additional details provided."}
        </p>
        <Button
          variant="warning"
          className="d-flex align-items-center"
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            padding: "10px 20px",
            borderRadius: "8px",
          }}
          onClick={handleArrangeMakeupSession}
        >
          <FaCalendarAlt className="me-2" />
          Arrange Makeup Session
        </Button>
      </div>
    </div>
  );
}

export default Workshopvm;
