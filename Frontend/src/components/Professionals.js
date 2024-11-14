import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import "../App.css";

function Professionals() { //Professionals
  const { sessionName, setSessionName } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("About");
  const navigate = useNavigate();
  const [isMemberActive, setIsMemberActive] = useState(false);

  useEffect(() => {
    setSessionName("Professionals");

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

    fetchMembershipStatus();
  }, [setSessionName]);

  const handleGetStarted = (tier) => {
    const discountedPrice = isMemberActive
      ? parseFloat(tier.price.replace("$", "")) * 0.9
      : parseFloat(tier.price.replace("$", ""));
  
    navigate("/payment", {
      state: {
        programId: tier.programId,
        tier: tier.level,
        price: `$${discountedPrice.toFixed(2)}`, // Pass the formatted discounted price or original price
        classSize: tier.classSize,
        duration: tier.duration,
      },
    });
  };

  const priceTiers = [
    {
      level: "Beginner",
      programId: 1,
      programName: "Professionals - Beginner",
      price: "$204",
      classSize: "15-20",
      duration: "3.5 days",
      lunchProvided: true,
      bgColor: "#e0f7fa",
    },
    {
      level: "Intermediate",
      programId: 2,
      programName: "Professionals - Intermediate",
      price: "$275",
      classSize: "10-15",
      duration: "3.5 days",
      lunchProvided: true,
      bgColor: "#e8f5e9",
    },
    {
      level: "Advanced",
      programId: 3,
      programName: "Professionals- Advanced",
      price: "$340",
      classSize: "5-10",
      duration: "3.5 days",
      lunchProvided: true,
      bgColor: "#f3e5f5",
    },
  ];

  const skillDevelopmentData = [
    {
      title: "Identifying Speaker Qualities",
      description: "Discover the traits that make a speaker influential and their presence captivating.",
    },
    {
      title: "Public Speaking Training",
      description: "Tiered workshops designed to transform participants into confident storytellers.",
    },
    {
      title: "Skills and Confidence Development",
      description: "Through engaging exercises and ample stage time, children gain essential speaking skills.",
    },
    {
      title: "Supportive Learning Environment",
      description: "Enables children to thrive while embracing the spotlight with enthusiasm and poise.",
    },
  ];

  return (
    <div className="workshop-container">
      <div className="hero-section position-relative">
        {/* Hero Section */}
        <img
          src={"/professionals.png"}
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
                    index !== skillDevelopmentData.length - 1 ? "1px solid #eee" : "none",
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
            className={`tab-item ${activeTab === "Details" ? "active" : ""}`}
            onClick={() => setActiveTab("Details")}
          >
            Details
          </div>
        </div>
        <hr className="mt-0" />
      </div>

      {activeTab === "About" 
      }

      {activeTab === "Details" && (
        <div className="details-section mt-4">
          <h3>Workshop Details</h3>
          <p>
            This workshop spans 3.5 days and is available in Beginner, Intermediate, and Advanced
            levels. Class sizes range from 5 to 20 participants, ensuring personalized attention.
          </p>
        </div>
      )}

      <div className="price-tiers-section mt-4">
        <div className="row g-4">
          {priceTiers.map((tier, index) => {
            const discountedPrice = isMemberActive
              ? parseFloat(tier.price.replace("$", "")) * 0.9
              : parseFloat(tier.price.replace("$", ""));
            return (
              <div key={index} className="col-md-4">
                <div
                  className="rounded-4 p-4 h-100 text-center shadow-sm"
                  style={{ backgroundColor: tier.bgColor }}
                >
                  <h5>{tier.level}</h5>
                  <div className="price-amount my-3">
                    {isMemberActive && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "10px",
                        }}
                      >
                        {tier.price}
                      </span>
                    )}
                    <span>${discountedPrice.toFixed(2)}</span>
                  </div>
                  <div className="tier-details mt-4 text-start">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-people-fill me-2"></i>
                      <span>Class size: {tier.classSize}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-clock-fill me-2"></i>
                      <span>Duration: {tier.duration}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check2-circle me-2"></i>
                      <span>{tier.lunchProvided ? "Lunch Provided" : "No Lunch"}</span>
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
  );
}

export default Professionals;
