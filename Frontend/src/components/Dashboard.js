import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChalkboardTeacher } from "react-icons/fa";
import AnnouncementBoard from "./AnnouncementBoard"; // Import AnnouncementBoard
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Programmes");
  const [customerName, setCustomerName] = useState("");
  const [reviewPrompt, setReviewPrompt] = useState(null); // Store program for review
  const [reviewContent, setReviewContent] = useState(""); // Review input from user
  const [reviewRating, setReviewRating] = useState(5); // Default rating
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  

  const userAccountID = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage

  // Calendar and Upcoming Events
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const generateCalendarDays = () => {
    const days = [];
    for (let i = -1; i < 3; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      days.push({
        day: date.getDate(),
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        current: i === 0,
        date: date,
      });
    }
    return days;
  };

  const generateUpcomingEvents = () => {
    const events = [
      { title: "Public Speaking Workshop", time: "15:00-16:30" },
      { title: "PSLE Power Up", time: "15:00-16:30" },
      { title: "1 to 1 Coaching", time: "15:00-16:30" },
      { title: "PSLE Power Up", time: "15:00-16:30" },
    ];

    return events.map((event, index) => {
      const eventDate = new Date();
      eventDate.setDate(currentDate.getDate() + index);
      return {
        ...event,
        date: eventDate.getDate().toString().padStart(2, "0"),
        isToday: index === 0,
      };
    });
  };

  const calendarDays = generateCalendarDays();
  const upcomingEvents = generateUpcomingEvents();

  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/customer/id/${userAccountID}`
        );
        if (response.data && response.data.length > 0) {
          setCustomerName(response.data[0].Name || "User");
        }
      } catch (error) {
        console.error("Error fetching customer name:", error);
      }
    };

    fetchCustomerName();
  }, [userAccountID]);

  useEffect(() => {
    const fetchProgramsAndSessions = async () => {
      try {
          console.log(" Fetching signed-up programs for AccountID:", userAccountID);
  
          const signUpResponse = await axios.get(`http://localhost:8000/signup/${userAccountID}`);
          const signUps = Array.isArray(signUpResponse.data) ? signUpResponse.data : [signUpResponse.data];
  
          console.log(" Raw sign-up data:", signUps);
  
          const signUpsWithDetails = await Promise.all(
              signUps.map(async (signup) => {
                  if (signup.SessionID) {
                      console.log(" Fetching session details for SessionID:", signup.SessionID);
  
                      const sessionResponse = await axios.get(
                          `http://localhost:8000/session/SessionID/${signup.SessionID}`
                      );
  
                      console.log(" Session API Response:", sessionResponse.data);
  
                      console.log(" Fetching tier details for TierID:", sessionResponse.data.TierID);
                      const tierResponse = await axios.get(
                          `http://localhost:8000/tier/${sessionResponse.data.TierID}`
                      );
  
                      console.log(" Tier API Response:", tierResponse.data);
  
                      console.log(" Fetching ProgramID for TierID:", sessionResponse.data.TierID);
                      const programResponse = await axios.get(
                          `http://localhost:8000/program/tier/${sessionResponse.data.TierID}`
                      );
  
                      console.log(" Program API Response:", programResponse.data);
  
                      //  Ensure ProgramID is correctly assigned inside `session`
                      return {
                          ...signup,
                          session: {
                              ...sessionResponse.data,
                              ProgramID: programResponse.data.ProgramIDs ? programResponse.data.ProgramIDs[0] : null,
                          },
                          tier: tierResponse.data,
                      };
                  }
                  return { ...signup, session: null, tier: null };
              })
          );
  
          console.log("🔍 Sign-ups with session & program details:", signUpsWithDetails);
  
          //  Find an ended program
          const endedPrograms = signUpsWithDetails.find((program) => {
              if (program.session && program.session.EndDate) {
                  const endDate = new Date(program.session.EndDate);
                  console.log(" Checking program end date:", endDate, "(Now:", new Date(), ")");
                  return endDate < new Date(); // Compare dates
              }
              return false;
          });
  
          if (endedPrograms) {
              console.log(" Ended program for review:", endedPrograms);
              if (endedPrograms.session?.ProgramID) {
                  setReviewPrompt(endedPrograms);
              } else {
                  console.error(" Error: `ProgramID` is missing in endedPrograms.session", endedPrograms.session);
              }
          }
  
          setPrograms(signUpsWithDetails);
      } catch (err) {
          console.error(" Error in fetchProgramsAndSessions:", err);
          setError("You have not signed up for any programs.");
      } finally {
          setLoading(false);
          console.log(" Finished fetching programs.");
      }
  };
  
  
  fetchProgramsAndSessions();
  

    fetchProgramsAndSessions();
}, [userAccountID]);

  

const handleReviewSubmit = async () => {
  if (!reviewContent.trim()) {
    alert("Please write a review before submitting.");
    return;
  }

  if (!reviewPrompt || !reviewPrompt.session) {
    alert("Session data is missing. Unable to submit review.");
    return;
  }

  const programID = reviewPrompt.session.ProgramID;
  const signUpID = reviewPrompt.SignUpID;

  if (!programID || !signUpID) {
    alert("Required IDs are missing. Unable to submit review.");
    return;
  }

  const payload = {
    Content: reviewContent,
    Star: reviewRating,
    AccountID: userAccountID,
    Date: new Date().toISOString(),
    ProgramID: programID,
  };

  try {
    await axios.post(`http://localhost:8000/review/`, payload);
    await axios.delete(`http://localhost:8000/signup/${signUpID}`);

    // Update the UI
    setPrograms((prevPrograms) =>
      prevPrograms.filter((program) => program.SignUpID !== signUpID)
    );

    setShowSuccessModal(true); // Show the success modal
    setReviewPrompt(null); // Close the review modal
    setReviewContent(""); // Clear review input
    setReviewRating(5); // Reset rating
  } catch (error) {
    console.error("Error submitting review or removing program:", error);
    alert("Failed to submit review. Please try again.");
  }
};


const handleCancelReview = async () => {
  if (!reviewPrompt || !reviewPrompt.SignUpID) {
    alert("Error: No SignUpID available to remove.");
    setShowCancelConfirm(false);
    return;
  }

  const signUpID = reviewPrompt.SignUpID;

  try {
    await axios.delete(`http://localhost:8000/signup/${signUpID}`);
    setPrograms((prevPrograms) =>
      prevPrograms.filter((program) => program.SignUpID !== signUpID)
    );

    setShowCancelConfirm(false); // Close cancel confirmation modal
    setReviewPrompt(null); // Close the review modal
    setReviewContent(""); // Clear review input
    setReviewRating(5); // Reset rating
  } catch (error) {
    console.error("Error removing program:", error);
    alert("Failed to remove sign-up. Please try again.");
  }
};

  
  const renderProgramCard = (data) => (
    <div
      key={data.SignUpID}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "8px",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "16px",
          flexShrink: 0,
        }}
      >
        <FaChalkboardTeacher
          size={40}
          style={{
            color: "#9ca3af",
          }}
        />
      </div>

      <div style={{ flexGrow: 1 }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "4px",
          }}
        >
          {data.tier[0]?.Name || "Unknown Program"}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "4px",
          }}
        >
          {new Date(data.session?.StartDate).toLocaleDateString()} -{" "}
          {new Date(data.session?.EndDate).toLocaleDateString()}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
          }}
        >
          {data.session?.Time} | {data.session?.Location}
        </p>
      </div>

      <button
        onClick={() =>
          navigate("/workshopvm", { state: { sessionId: data.session?.SessionID } })
        }
        style={{
          backgroundColor: "#fbbf24",
          color: "white",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "medium",
          textDecoration: "none",
          transition: "background-color 0.2s ease-in-out",
          cursor: "pointer",
          border: "none",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
      >
        View More
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex space-x-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            Welcome Back, {customerName}
          </h1>

          <button
            onClick={() => setActiveTab("Programmes")}
            style={{
              fontSize: "16px",
              fontWeight: activeTab === "Programmes" ? "bold" : "normal",
              color: activeTab === "Programmes" ? "#f59e0b" : "#6b7280",
              padding: "8px 16px",
              borderBottom:
                activeTab === "Programmes" ? "2px solid #fbbf24" : "none",
              cursor: "pointer",
            }}
          >
            Programmes
          </button>

          {activeTab === "Programmes" && (
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : programs.length > 0 ? (
                programs.map((program) => renderProgramCard(program))
              ) : (
                <p>No programs signed up yet.</p>
              )}
            </div>
          )}
          {activeTab === "Webinars" && <p>No webinars available yet.</p>}
        </div>

        <div className="w-80">
          {/* Announcement Board */}
          <div className="mb-8">
            <AnnouncementBoard />
          </div>

          {/* Calendar */}
          <div>
            <h2 className="text-lg font-semibold mb-4">{monthYear}</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              {calendarDays.map((date) => (
                <div key={date.label}>
                  <div className="text-sm text-gray-500">{date.label}</div>
                  <div
                    className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                      date.current ? "bg-yellow-500 text-white" : ""
                    }`}
                  >
                    {date.day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className={`flex items-start p-3 rounded-lg ${
                    event.isToday
                      ? "bg-white shadow-sm border border-gray-100"
                      : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-xl font-bold w-8 ${
                      event.isToday ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {event.date}
                  </div>
                  <div className="ml-4">
                    <div
                      className={`font-medium ${
                        event.isToday ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {event.title}
                    </div>
                    <div
                      className={`text-sm ${
                        event.isToday ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

                {/* Review Prompt Modal */}
                {reviewPrompt && (
                  <div style={reviewModalOverlayStyle}>
  <div style={reviewModalContentStyle}>
    <h2 style={reviewModalHeaderStyle}>
      Leave a Review for {reviewPrompt.tier?.[0]?.Name}
    </h2>
    <textarea
      value={reviewContent}
      onChange={(e) => setReviewContent(e.target.value)}
      placeholder="Write your review here..."
      style={reviewTextareaStyle}
    />
    <div style={starContainerStyle}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setReviewRating(star)}
          style={starStyle(star <= reviewRating)}
        >
          ★
        </span>
      ))}
    </div>
    <button onClick={handleReviewSubmit} style={reviewSubmitButtonStyle}>
      Submit
    </button>
    <button
      onClick={() => setShowCancelConfirm(true)}
      style={reviewCancelButtonStyle}
    >
      Cancel
    </button>
  </div>
</div>

)}
      {/* Success Modal */}
      {showSuccessModal && (
  <div style={successModalOverlayStyle}>
    <div style={successModalContentStyle}>
      <h2 style={successModalHeaderStyle}>Review Submitted</h2>
      <p style={{ marginBottom: "20px" }}>Thank you for your feedback!</p>
      <button
        onClick={() => setShowSuccessModal(false)}
        style={successModalCloseButtonStyle}
      >
        Close
      </button>
    </div>
  </div>
)}

       {/* Cancel Confirmation Modal */}
       {showCancelConfirm && (
  <div style={reviewModalOverlayStyle}>
    <div style={reviewModalContentStyle}>
      <h2 style={reviewModalHeaderStyle}>Are you sure?</h2>
      <p>Cancelling will remove your sign-up.</p>
      <button onClick={handleCancelReview} style={reviewSubmitButtonStyle}>
        Yes, Remove
      </button>
      <button
        onClick={() => setShowCancelConfirm(false)}
        style={reviewCancelButtonStyle}
      >
        No, Keep It
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );

  
}

const cancelModalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cancelModalContentStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  maxWidth: "400px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
  border: "3px solid #FFC107", // Gold Border
};



const successModalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const successModalContentStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  maxWidth: "400px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
  border: "#FFC107", // Blue Border
};

const successModalHeaderStyle = {
  marginBottom: "15px",
  fontSize: "22px",
  fontWeight: "bold",
  color: "3px solid #FFC107", // Bootstrap Green for Success
};

const successModalCloseButtonStyle = {
  backgroundColor: " #FFC107", // Bootstrap Green
  color: "black",
  padding: "12px 20px",
  border: "none",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};
const reviewModalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const reviewModalContentStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  maxWidth: "500px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // Smooth shadow
  border: "3px solid #FFC107", // Gold Border
};

const reviewModalHeaderStyle = {
  marginBottom: "15px",
  fontSize: "22px",
  fontWeight: "bold",
  color: "#0D6EFD", // Blue Header Text
};

const reviewTextareaStyle = {
  width: "100%",
  height: "120px",
  padding: "12px",
  borderRadius: "6px",
  border: "2px solid black", // Black border for input
  marginBottom: "15px",
  fontSize: "16px",
  outline: "none",
};

const starContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "15px",
};

const starStyle = (isActive) => ({
  fontSize: "24px",
  cursor: "pointer",
  color: isActive ? "#FFC107" : "#CCCCCC", // Gold for active stars, Gray for inactive
});

const reviewSubmitButtonStyle = {
  backgroundColor: "#FFC107", // Gold for Submit Button
  color: "black",
  padding: "12px 20px",
  border: "none",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  marginRight: "10px",
  transition: "background-color 0.3s ease",
};

const reviewCancelButtonStyle = {
  backgroundColor: "#DC3545", // Red for Cancel Button
  color: "white",
  padding: "12px 20px",
  border: "none",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};



export default Dashboard;
