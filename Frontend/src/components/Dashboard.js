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

  console.log("🔍 Review Prompt Data:", reviewPrompt);

  if (!reviewPrompt || !reviewPrompt.session) {
      console.error(" Error: `session` object is missing in reviewPrompt.");
      alert("Session data is missing. Unable to submit review.");
      return;
  }

  //  Fetch ProgramID directly from reviewPrompt.session
  const programID = reviewPrompt.session.ProgramID;
  const signUpID = reviewPrompt.SignUpID; // Get the SignUpID for deletion

  console.log(" ProgramID from `reviewPrompt.session`:", programID);
  console.log(" SignUpID for deletion:", signUpID);

  if (!programID || !signUpID) {
      console.error(" Error: `ProgramID` or `SignUpID` is missing in session data.");
      alert("Required IDs are missing. Unable to submit review.");
      return;
  }

  const payload = {
      Content: reviewContent,
      Star: reviewRating,
      AccountID: userAccountID,
      Date: new Date().toISOString(),
      ProgramID: programID, //  Now ProgramID is guaranteed
  };

  console.log(" Submitting review:", payload);

  try {
      //  Submit the review
      const reviewResponse = await axios.post(`http://localhost:8000/review/`, payload);
      console.log("Review submission successful:", reviewResponse.data);

      // Delete the SignUp entry to remove the program from the database
      console.log(`Deleting SignUp entry with SignUpID: ${signUpID}`);
      await axios.delete(`http://localhost:8000/signup/${signUpID}`);
      console.log("Successfully removed ended program from database.");

      alert("Thank you for your review!");

      // Remove the reviewed program from the UI
      setPrograms((prevPrograms) => prevPrograms.filter(
          (program) => program.SignUpID !== signUpID
      ));

      // Close the review prompt and reset form
      setReviewPrompt(null);
      setReviewContent("");
      setReviewRating(5); // Reset review form

  } catch (error) {
      console.error(" Error submitting review or removing program:", error);

      if (error.response) {
          console.error(" Server responded with:", error.response.data);
          alert(`Failed to submit review: ${error.response.data.message || "Unknown error"}`);
      } else {
          alert("Failed to submit review. Please check your network connection.");
      }
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
      {reviewPrompt &&  (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
              Leave a Review for {reviewPrompt.tier[0]?.Name}
            </h2>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Write your review here..."
              style={{
                width: "100%",
                height: "100px",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <div style={{ marginBottom: "10px" }}>
              <label>Rating: </label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                style={{
                  padding: "5px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} ⭐
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleReviewSubmit}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Submit
            </button>
            <button
              onClick={() => setReviewPrompt(null)}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
