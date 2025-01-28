import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import "../App.css";

function WorkshopDetails() {
  const { sessionName, setSessionName } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("About");
  const navigate = useNavigate();
  const { id } = useParams();

  const [programDetails, setProgramDetails] = useState({});
  const [isMemberActive, setIsMemberActive] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programResponse = await axios.get(
          `http://localhost:8000/program/${id}`
        );
        const programData = programResponse.data;
        setProgramDetails(programData);
        setSessionName(programData.ProgramName);

        const userId = localStorage.getItem("userId");
        if (userId) {
          const membershipResponse = await axios.get(
            `http://localhost:8000/customer/id/${userId}`
          );
          const membershipData = membershipResponse.data;
          if (membershipData && membershipData.length > 0) {
            setIsMemberActive(membershipData[0].MemberStatus === 1);
          }
        }

        const reviewsResponse = await axios.get(
          `http://localhost:8000/review/${id}`
        );
        setReviews(reviewsResponse.data);

        const tiersResponse = await axios.get(
          `http://localhost:8000/tier/program/${id}`
        );
        const tierData = tiersResponse.data;

        const tiersWithSessions = await Promise.all(
          tierData.map(async (tier) => {
            try {
              const sessionResponse = await axios.get(
                `http://localhost:8000/session/${tier.TierID}`
              );
              return {
                ...tier,
                sessions: sessionResponse.data || [],
              };
            } catch (error) {
              console.error(
                `Error fetching sessions for tier ${tier.TierID}:`,
                error
              );
              return { ...tier, sessions: [] };
            }
          })
        );

        setTiers(tiersWithSessions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, setSessionName]);

  const handleGetStarted = (tier) => {
    const discountedPrice = isMemberActive
      ? parseFloat(tier.Cost) * 0.9
      : parseFloat(tier.Cost);

    navigate("/payment", {
      state: {
        programId: tier.ProgramID,
        tier: tier.Name,
        price: `$${discountedPrice.toFixed(2)}`,
        classSize: tier.ClassSize,
        duration: tier.Duration,
      },
    });
  };

  const openTierModal = (tier) => {
    setSelectedTier(tier);
  };

  const closeTierModal = () => {
    setSelectedTier(null);
  };

  const skillDevelopmentData = [
    {
      title: "Personal Growth",
      description: "Develop confidence and eloquence in public speaking.",
    },
    {
      title: "Presentation Skills",
      description:
        "Learn how to captivate your audience with engaging presentations.",
    },
    {
      title: "Effective Communication",
      description:
        "Enhance your ability to convey information clearly and persuasively.",
    },
    {
      title: "Dynamic Storytelling",
      description:
        "Master the art of storytelling to make your speeches impactful.",
    },
  ];

  return (
    <div className="workshop-container">
      <div className="hero-section position-relative">
        <img
          src={"img/workshops.jpg"}
          alt={programDetails.ProgramName || "Public Speaking"}
          className="w-100"
          style={{ minHeight: "600px", objectFit: "cover" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))",
          }}
        ></div>
        <div
          className="hero-content position-absolute"
          style={{
            bottom: "100px",
            left: "20px",
            textAlign: "left",
            width: "auto",
          }}
        >
          <h1
            className="text-white mb-3"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {programDetails.ProgramName || sessionName}
          </h1>
        </div>

        <div className="skibidi-section position-absolute w-100">
          <div className="d-flex justify-content-center">
            {skillDevelopmentData.map((skill, index) => (
              <div
                key={index}
                className="skibidi-box bg-white p-3 flex-grow-1"
                style={{
                  ...(index === 0 && {
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  }),
                  ...(index === skillDevelopmentData.length - 1 && {
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  }),
                }}
              >
                <h6
                  className="mb-2"
                  style={{
                    color: "#333",
                    fontSize: "1.1rem",
                  }}
                >
                  {skill.title}
                </h6>
                <p
                  className="mb-0 text-muted"
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section mt-4">
        <div className="d-flex">
          <div
            className={`tab-item ${activeTab === "About" ? "active" : ""}`}
            onClick={() => setActiveTab("About")}
            style={{
              color: activeTab === "About" ? "#fbbf24" : "#000",
              borderBottom:
                activeTab === "About" ? "2px solid #fbbf24" : "none",
              backgroundColor: "transparent",
              padding: "10px 20px",
              marginRight: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            About
          </div>
          <div
            className={`tab-item ${activeTab === "Reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("Reviews")}
            style={{
              color: activeTab === "Reviews" ? "#fbbf24" : "#000",
              borderBottom:
                activeTab === "Reviews" ? "2px solid #fbbf24" : "none",
              backgroundColor: "transparent",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reviews
          </div>
        </div>
        <hr className="mt-0" />
      </div>

      {/* Content Sections */}
      {activeTab === "About" && (
        <div className="details-section mt-4">
          {/* Tiers Section */}
          <div className="price-tiers-section mt-4">
            <div
              className="row g-4"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {tiers.map((tier, index) => {
                const discountedPrice = isMemberActive
                  ? parseFloat(tier.Cost) * 0.9
                  : parseFloat(tier.Cost);
                return (
                  <div
                    key={index}
                    className="tier-card d-flex justify-content-center p-4 shadow-sm rounded"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #ddd",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <h5
                        className="text-dark mb-3"
                        style={{
                          color: "#2F455B",
                          fontWeight: "bold",
                          fontSize: "1.25rem",
                        }}
                      >
                        {tier.Name}
                      </h5>
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3">
                          <span className="text-danger text-decoration-line-through">
                            {isMemberActive ? `$${tier.Cost}` : ""}
                          </span>{" "}
                          <span className="fw-bold text-dark">
                            ${tier.DiscountedCost}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex flex-column mb-3">
                        <div>
                          <i className="bi bi-people me-2"></i>
                          Class Size: {tier.ClassSize}
                        </div>
                        <div>
                          <i className="bi bi-clock me-2"></i>
                          Duration: {tier.Duration} days
                        </div>
                        <div>
                          <i className="bi bi-box-seam me-2"></i>
                          {tier.LunchProvided ? "Lunch Provided" : "No Lunch"}
                        </div>
                      </div>
                      <div className="sessions mb-3">
                        <h6 className="fw-bold text-dark">
                          Session dates available:
                        </h6>
                        {tier.sessions.length > 0 ? (
                          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                            {tier.sessions.map((session, i) => (
                              <li
                                key={i}
                                style={{
                                  backgroundColor: "#F9FAFB",
                                  padding: "0.75rem",
                                  borderRadius: "8px",
                                  marginBottom: "0.5rem",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                                  <strong>Date:</strong>{" "}
                                  {new Date(
                                    session.StartDate
                                  ).toLocaleDateString()}
                                </p>
                                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                                  <strong>Time:</strong> {session.Time}
                                </p>
                                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                                  <strong>Location:</strong> {session.Location}
                                </p>
                                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                                  <strong>Vacancy:</strong> {session.Vacancy}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>
                            No sessions available currently, please check back
                            again!
                          </p>
                        )}
                      </div>
                      {tier.sessions.length > 0 && (
                        <button
                          className="btn btn-warning fw-bold w-100 mt-auto"
                          style={{
                            padding: "0.75rem",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            backgroundColor: "#2F455B",
                            color: "#ffffff",
                            border: "none",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => handleGetStarted(tier)}
                        >
                          Get Started
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Reviews" && (
        <div
          className="reviews-section mt-4"
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "#f7f9fc",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h5
            className="mb-4"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              color: "#000000",
            }}
          >
            What Participants Say About{" "}
            {programDetails.ProgramName || "This Workshop"}
          </h5>
          {reviews.length > 0 ? (
            <div
              className="reviews-container"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="review-item"
                  style={{
                    background: "#fff",
                    padding: "1.5rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <p
                    className="review-content"
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.5",
                      color: "#333",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {review.Content}
                  </p>
                  <div
                    className="review-footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.9rem",
                      color: "#888",
                    }}
                  >
                    <span className="review-date">
                      {new Date(review.Date).toLocaleDateString()}
                    </span>
                    <div
                      className="review-rating"
                      style={{
                        color: "#f39c12",
                        fontWeight: "bold",
                      }}
                    >
                      {Array(review.Star).fill("⭐").join("")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                fontSize: "1rem",
                color: "#666",
              }}
            >
              No reviews yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkshopDetails;
