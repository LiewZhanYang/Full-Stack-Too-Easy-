import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Workshopvm() {
  const location = useLocation();
  const { signUpId } = location.state || {};
  const [programDetails, setProgramDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [childName, setChildName] = useState("");

  const userAccountID = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!signUpId) throw new Error("No SignUpID provided.");

        // Fetch the signup details
        const signupResponse = await axios.get(`http://localhost:8000/signup/${userAccountID}`);
        const signups = signupResponse.data;

        // Find the signup entry that matches signUpId
        const signup = signups.find((s) => s.SignUpID === signUpId);
        if (!signup || !signup.SessionID) throw new Error("Signup or SessionID not found.");

        // Fetch session details
        const sessionResponse = await axios.get(`http://localhost:8000/session/SessionID/${signup.SessionID}`);
        const session = sessionResponse.data;

        // Fetch program details
        const programResponse = await axios.get(`http://localhost:8000/program/${session.ProgramID}`);
        const program = programResponse.data;

        // Fetch children data to get the child's name
        const childrenResponse = await axios.get(`http://localhost:8000/children/${userAccountID}`);
        const children = childrenResponse.data;
        const child = children.find((c) => c.ChildID === signup.ChildID);

        setChildName(child ? child.Name : "Unknown Child");

        setProgramDetails({
          programName: program.ProgrameName,
          programId: program.ProgramID,
          location: session.Location,
          date: `${new Date(session.StartDate).toLocaleDateString()} - ${new Date(session.EndDate).toLocaleDateString()}`,
          time: session.Time,
          lunchOption: signup.LunchOptionID === 1 ? "Vegetarian" : signup.LunchOptionID === 2 ? "Non-Vegetarian" : "Not Selected",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching program details:", err);
        setError(err.message || "Failed to fetch program details.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [signUpId, userAccountID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{programDetails.programName}</h1>
      <p style={styles.date}>{programDetails.date}</p>
      <hr style={styles.line} />

      <div style={styles.descriptionContainer}>
        {programDetails.programId === 1 || programDetails.programId === 2 || programDetails.programId === 3 ? (
          <>
            <h2 style={styles.subtitle}>Description</h2>
            <p style={styles.description}>
              We identify with what makes a speaker influential and his presence compelling. Our tiered public speaking
              workshops are thoughtfully designed to transform your child into a seasoned stage storyteller through
              comprehensive training. From dynamic activities to stage design, your ward will acquire the skills and
              confidence to shine under the spotlight. Watch them take them on the art and science of impactful speaking
              in a supportive and immersive environment. Get your child a breakthrough in powerful communication today,
              reach out to us for the programme synopsis and workshop content!
            </p>
            <h3 style={styles.keyPointsTitle}>Key Points</h3>
            <ul style={styles.keyPointsList}>
              <li>
                <b>Stage Storytelling:</b> Focus on developing confident stage storytellers through comprehensive
                training.
              </li>
              <li>
                <b>Dynamic Learning:</b> Engage in dynamic activities and ample stage time to enhance speaking abilities.
              </li>
              <li>
                <b>Supportive Environment:</b> A nurturing atmosphere that fosters confidence and effective
                communication.
              </li>
            </ul>
          </>
        ) : (
          <h2 style={styles.subtitle}>Details</h2>
        )}
        <div style={styles.detailsRow}>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Location</span>
            <span>{programDetails.location}</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Time</span>
            <span>{programDetails.time}</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Child Name</span>
            <span>{childName}</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Lunch Option</span>
            <span>{programDetails.lunchOption}</span>
          </div>
        </div>
      </div>
      <button style={styles.cancelButton}>Cancel Booking</button> 
    </div>
  );
}


const styles = {
  container: {
    fontFamily: "League Spartan, sans-serif",
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
  },
  date: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
  },
  line: {
    border: "none",
    borderBottom: "1px solid #ddd",
    marginBottom: "20px",
  },
  descriptionContainer: {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
  },
  subtitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#333",
    marginBottom: "15px",
  },
  keyPointsTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    marginBottom: "5px",
  },
  keyPointsList: {
    fontSize: "14px",
    lineHeight: "1.6",
    paddingLeft: "20px",
    listStyleType: "disc",
    margin: "10px 0",
  },
  detailsRow: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  detailsItem: {
    textAlign: "left",
    marginBottom: "10px",
    width: "48%",
  },
  detailsLabel: {
    display: "block",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "5px",
  },
  cancelButton: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#FFC107",
    color: "#333",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default Workshopvm;
