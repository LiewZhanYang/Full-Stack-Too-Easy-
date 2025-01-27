import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import "../App.css";

function WorkshopDetails() {
  const { sessionName, setSessionName } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("About");
  const navigate = useNavigate();
  const [isMemberActive, setIsMemberActive] = useState(false);
  const [reviews, setReviews] = useState({});
  const [tiers, setTiers] = useState([]); // State to hold fetched tiers

  useEffect(() => {
    setSessionName("Public Speaking Workshop");

    const userId = localStorage.getItem("userId");
    const fetchMembershipStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/customer/id/${userId}`
        );
        if (response.data && response.data.length > 0) {
          setIsMemberActive(response.data[0].MemberStatus === 1);
        }
      } catch (error) {
        console.error("Error fetching membership status:", error);
      }
    };

    // Fetch reviews for ProgramID 1
    const fetchReviewsForProgram1 = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/review/1`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchMembershipStatus();
    fetchReviewsForProgram1();
  }, [setSessionName]);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tier/1`); // Adjust URL to your backend
        setTiers(response.data); // Update the state with the fetched tiers
      } catch (error) {
        console.error("Error fetching tiers:", error);
      }
    };

    fetchTiers(); // Fetch tiers when the component mounts
  }, []);

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
        {/* Hero Section */}
        <img
          src={"img/workshops.jpg"}
          alt="Public Speaking"
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
            padding: 0,
          }}
        >
          <h1
            className="text-white mb-3"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              marginLeft: 10,
              transform: "translateY(20px)",
            }}
          >
            {sessionName}
          </h1>
        </div>

        <div className="skibidi-section position-absolute w-100">
          <div className="d-flex justify-content-center">
            {skillDevelopmentData.map((skill, index) => (
              <div
                key={index}
                className="skibidi-box bg-white p-3 flex-grow-1"
                style={{
                  borderRight:
                    index !== skillDevelopmentData.length - 1
                      ? "1px solid #eee"
                      : "none",
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
                <h6 className="mb-2" style={{ color: "#333" }}>
                  {skill.title}
                </h6>
                <p className="mb-0 small text-muted">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs-section mt-4">
        <div className="d-flex">
          <div
            className={`tab-item ${activeTab === "About" ? "active" : ""}`}
            onClick={() => setActiveTab("About")}
          >
            About
          </div>
          <div
            className={`tab-item ${activeTab === "Reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("Reviews")}
          >
            Reviews
          </div>
        </div>
        <hr className="mt-0" />
      </div>

      {activeTab === "About" && (
        <div className="details-section mt-4">
          <p
            style={{
              padding: "0 15px",
              fontSize: "1rem",
              lineHeight: "1.5",
              color: "#333",
            }}
          >
            This workshop spans 3.5 days and is available in Beginner,
            Intermediate, and Advanced levels. Class sizes range from 5 to 20
            participants, ensuring personalized attention.
          </p>
          <div className="price-tiers-section mt-4">
            <div
              className="row g-4"
              style={{
                justifyContent: tiers.length === 1 ? "center" : "flex-start",
              }}
            >
              {tiers.map((tier, index) => {
                const discountedPrice = isMemberActive
                  ? parseFloat(tier.Cost) * 0.9
                  : parseFloat(tier.Cost);
                return (
                  <div
                    key={index}
                    className={`col-md-${
                      tiers.length === 1 ? "6" : "4"
                    } d-flex justify-content-center`}
                  >
                    <div
                      className="rounded-4 p-4 h-100 text-center shadow-sm"
                      style={{ backgroundColor: "#e0f7fa" }}
                    >
                      <h5>{tier.Name}</h5>
                      <div className="price-amount my-3">
                        {isMemberActive && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "red",
                              marginRight: "10px",
                            }}
                          >
                            ${tier.Cost}
                          </span>
                        )}
                        <span>${discountedPrice.toFixed(2)}</span>
                      </div>
                      <div className="tier-details mt-4 text-start">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-people-fill me-2"></i>
                          <span>Class size: {tier.ClassSize}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-clock-fill me-2"></i>
                          <span>Duration: {tier.Duration} days</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-check2-circle me-2"></i>
                          <span>
                            {tier.LunchProvided ? "Lunch Provided" : "No Lunch"}
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline-primary rounded-pill w-100 mt-3"
                        onClick={() => handleGetStarted(tier)}
                      >
                        Get Started
                      </button>
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
            className="text-primary mb-4"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#007bff",
              marginBottom: "1.5rem",
            }}
          >
            What Participants Say About Public Speaking Workshop
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
                        color: "#f39c12", // Gold star color
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
              Loading reviews...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkshopDetails;
