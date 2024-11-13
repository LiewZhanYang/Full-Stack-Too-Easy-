import React from "react";


function Workshopvm() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Public Speaking Workshop</h1>
      <p style={styles.date}>4 April 2025</p>
      <hr style={styles.line} />

      <div style={styles.descriptionContainer}>
        <h2 style={styles.subtitle}>Description</h2>
        <p style={styles.description}>
          We identify with what makes a speaker influential and his presence
          compelling. Our tiered public speaking workshops are thoughtfully
          designed to transform your child into a seasoned stage storyteller
          through comprehensive training. From dynamic activities to stage
          design, your ward will acquire the skills and confidence to shine
          under the spotlight. Watch them take them on the art and science of
          impactful speaking in a supportive and immersive environment. Get your
          child a breakthrough in powerful communication today, reach out to us
          for the programme synopsis and workshop content!
        </p>
        <h3 style={styles.keyPointsTitle}>Key Points</h3>
        <ul style={styles.keyPointsList}>
          <li>
            <b>Stage Storytelling:</b> Focus on developing confident stage
            storytellers through comprehensive training.
          </li>
          <li>
            <b>Dynamic Learning:</b> Engage in dynamic activities and ample
            stage time to enhance speaking abilities.
          </li>
          <li>
            <b>Supportive Environment:</b> A nurturing atmosphere that fosters
            confidence and effective communication.
          </li>
        </ul>

        {/* Moved details inside descriptionContainer */}
        <div style={styles.detailsRow}>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Date</span>
            <span>4 April 2025</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Starts</span>
            <span>13:00</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>End</span>
            <span>14:00</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Instructor</span>
            <span>aaaaaaa</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Pax</span>
            <span>1</span>
          </div>
          <div style={styles.detailsItem}>
            <span style={styles.detailsLabel}>Lunch Option</span>
            <span>Vegetarian</span>
          </div>
        </div>

        <button style={styles.button}>Cancel Booking</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
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
    padding: "10px 0",
  },
  detailsItem: {
    textAlign: "center",
    width: "16%",
  },
  detailsLabel: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ffcc00",
    color: "#333",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Workshopvm;
