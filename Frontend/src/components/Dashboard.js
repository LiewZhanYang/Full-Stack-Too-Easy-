import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChalkboardTeacher } from "react-icons/fa";

function Dashboard() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Programmes");

  const userAccountID = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage

  // Calendar and Upcoming Events
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Generate 4-day Calendar
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

  // Generate Upcoming Events
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
    const fetchProgramsAndSessions = async () => {
      try {
        // Step 1: Fetch all signups for the user
        const signUpResponse = await axios.get(`http://localhost:8000/signup/${userAccountID}`);
        const signUps = Array.isArray(signUpResponse.data) ? signUpResponse.data : [signUpResponse.data];
        console.log("Processed SignUps:", signUps);

        // Step 2: Fetch session details for each signup
        const signUpsWithSessions = await Promise.all(
          signUps.map(async (signup) => {
            if (signup.SessionID) {
              try {
                const sessionResponse = await axios.get(`http://localhost:8000/session/SessionID/${signup.SessionID}`);
                return { ...signup, session: sessionResponse.data, ProgramID: sessionResponse.data.ProgramID }; // Add ProgramID from session
              } catch (err) {
                console.error(`Failed to fetch session for SessionID: ${signup.SessionID}`, err);
                return { ...signup, session: null, ProgramID: null }; // Handle error gracefully
              }
            } else {
              return { ...signup, session: null, ProgramID: null }; // No session associated
            }
          })
        );
        console.log("SignUps with Session Details:", signUpsWithSessions);

        // Step 3: Fetch all programs associated with the user
        const programResponse = await axios.get(`http://localhost:8000/program/signup/${userAccountID}`);
        const programs = programResponse.data;
        console.log("Fetched Programs:", programs);

        // Step 4: Combine programs with signups
        const combinedData = signUpsWithSessions.map((signup) => {
          const matchingProgram = programs.find(
            (program) => Number(program.ProgramID) === Number(signup.ProgramID)
          );
          if (!matchingProgram) {
            console.warn(`No matching program found for ProgramID: ${signup.ProgramID}`);
          }
          return { ...signup, program: matchingProgram || null }; // Merge program details into signup
        });

        console.log("Final Combined Data (Programs and Sessions):", combinedData);

        setPrograms(combinedData); // Update state with combined data
      } catch (err) {
        setError("Failed to load programs and sessions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramsAndSessions();
  }, [userAccountID]);

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
      {/* Icon Section */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "8px",
          backgroundColor: "#f3f4f6", // Light gray background for the icon
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "16px",
          flexShrink: 0,
        }}
      >
        <FaChalkboardTeacher
          size={40} // Icon size (can be adjusted as needed)
          style={{
            color: "#9ca3af", // Neutral gray for the icon color
          }}
        />
      </div>

      {/* Content Section */}
      <div style={{ flexGrow: 1 }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "4px",
          }}
        >
          {data.program?.ProgrameName || "Unknown Program"}
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

      {/* View More Button */}
      <a
        href={`./workshopvm`}
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
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
      >
        View More
      </a>
    </div>
  );

  return (
<div className="p-4">
  <div className="flex space-x-8">
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-6">Welcome Back, User</h1>

      {/* Tabs Section */}
      <div className="flex space-x-4 mb-4 border-b-2 pb-2">
        <button
          onClick={() => setActiveTab("Programmes")}
          style={{
            fontSize: "16px",
            fontWeight: activeTab === "Programmes" ? "bold" : "normal",
            color: activeTab === "Programmes" ? "#f59e0b" : "#6b7280",
            padding: "8px 16px",
            backgroundColor: "transparent",
            borderBottom: activeTab === "Programmes" ? "2px solid #fbbf24" : "none",
            transition: "color 0.3s ease, border-bottom 0.3s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.color = "#f59e0b")}
          onMouseOut={(e) =>
            (e.target.style.color =
              activeTab === "Programmes" ? "#f59e0b" : "#6b7280")
          }
        >
          Programmes
        </button>
        <button
          onClick={() => setActiveTab("Webinars")}
          style={{
            fontSize: "16px",
            fontWeight: activeTab === "Webinars" ? "bold" : "normal",
            color: activeTab === "Webinars" ? "#f59e0b" : "#6b7280",
            padding: "8px 16px",
            backgroundColor: "transparent",
            borderBottom: activeTab === "Webinars" ? "2px solid #fbbf24" : "none",
            transition: "color 0.3s ease, border-bottom 0.3s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.color = "#f59e0b")}
          onMouseOut={(e) =>
            (e.target.style.color = activeTab === "Webinars" ? "#f59e0b" : "#6b7280")
          }
        >
          Webinars
        </button>
      </div>

      {/* Programs and Sessions */}
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
      {activeTab === "Webinars" && (
        <div>
          <p>No webinars available yet.</p>
        </div>
      )}
    </div>

    {/* Calendar and Upcoming Events */}
    <div className="w-80">
      <div>
        <h2 className="text-lg font-semibold mb-4">{monthYear}</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          {calendarDays.map((date) => (
            <div key={date.label}>
              <div className="text-sm text-gray-500">{date.label}</div>
              <div
                className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto
                ${date.current ? "bg-yellow-500 text-white" : ""}`}
              >
                {date.day}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-2">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className={`flex items-start p-3 rounded-lg transition-all duration-200
                ${event.isToday ? "bg-white shadow-sm border border-gray-100" : "bg-gray-50"}`}
            >
              <div
                className={`text-xl font-bold w-8 
                ${event.isToday ? "text-gray-800" : "text-gray-400"}`}
              >
                {event.date}
              </div>
              <div className="ml-4">
                <div
                  className={`font-medium 
                  ${event.isToday ? "text-gray-800" : "text-gray-500"}`}
                >
                  {event.title}
                </div>
                <div
                  className={`text-sm 
                  ${event.isToday ? "text-gray-600" : "text-gray-400"}`}
                >
                  {event.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default Dashboard;
