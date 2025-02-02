import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Workshopvm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = location.state; // Use `SessionID` instead of `SignUpID`
  const [workshopDetails, setWorkshopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      try {
        // Fetch session details
        const sessionResponse = await axios.get(
          `http://localhost:8000/session/SessionID/${sessionId}`
        );
        const sessionData = sessionResponse.data;

        if (!sessionData) {
          setError("Session details not found for this ID.");
          return;
        }

        // Fetch tier details
        let tierDetails = null;
        if (sessionData.TierID) {
          const tierResponse = await axios.get(
            `http://localhost:8000/tier/${sessionData.TierID}`
          );
          tierDetails = tierResponse.data;
        }

        setWorkshopDetails({
          session: sessionData,
          tier: tierDetails,
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

  const { session, tier } = workshopDetails;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
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
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
          {tier?.[0]?.Name || "Unknown Program"}
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
      </div>
    </div>
  );
}

export default Workshopvm;
