import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function PslePowerCamp() {
  const [activeTab, setActiveTab] = useState('About');
  const navigate = useNavigate();

  const handleGetStarted = (tier) => {
    navigate('/payment', {
      state: {
        tier: tier.level,
        price: tier.price,
        classSize: tier.classSize,
        duration: tier.duration
      }
    });
  };

  const priceTiers = [
    {
      level: "Beginner",
      price: "$204",
      classSize: "15-20",
      duration: "3 days",
      bgColor: "#e0f7fa"
    },
    {
      level: "Intermediate",
      price: "$275",
      classSize: "10-15",
      duration: "4 days",
      bgColor: "#e8f5e9"
    },
    {
      level: "Advanced",
      price: "$340",
      classSize: "5-10",
      duration: "5 days",
      bgColor: "#f3e5f5"
    }
  ];

  const skillDevelopmentData = [
    {
      title: "PSLE Exam Preparation",
      description: "Comprehensive coverage of PSLE subjects and exam strategies."
    },
    {
      title: "Time Management",
      description: "Learn effective techniques to manage your time during the PSLE."
    },
    {
      title: "Stress Management",
      description: "Develop coping mechanisms to handle the pressure of the PSLE."
    },
    {
      title: "Study Skills",
      description: "Master proven study methods to maximize your PSLE performance."
    }
  ];

  return (
    <div className="workshop-container">
      <div className="hero-section position-relative">
        <img
          src={"/psle-power.png"}
          alt="PSLE Power Camp"
          className="w-100"
          style={{ minHeight: '600px', objectFit: 'cover' }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
          }}
        ></div>
        <div
          className="hero-content position-absolute"
          style={{
            bottom: '100px',
            left: '20px',
            textAlign: 'left',
            width: 'auto',
            padding: 0,
          }}
        >
          <h1
            className="text-white mb-3"
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              marginLeft: 10,
              transform: 'translateY(20px)'
            }}
          >
            PSLE Power Camp
          </h1>
        </div>

        <div className="course-details-box position-absolute bg-white rounded-3 shadow-lg p-4">
          <ul className="list-unstyled mb-3">
            <h2 className="text-center fw-bold mb-3">Join this Camp Today!</h2>
            <li className="mb-2">• Comprehensive PSLE preparation</li>
            <li className="mb-2">• Develop effective study skills</li>
            <li className="mb-2">• Learn time and stress management</li>
            <li className="mb-2">• Personalized guidance and support</li>
            <li className="mb-2">• Boost your PSLE performance</li>
          </ul>
          <button className="btn btn-primary w-100 rounded-pill">Learn More</button>
        </div>

        <div className="skibidi-section position-absolute w-100">
          <div className="d-flex justify-content-center">
            {skillDevelopmentData.map((skill, index) => (
              <div
                key={index}
                className="skibidi-box bg-white p-3 flex-grow-1"
                style={{
                  borderRight: index !== skillDevelopmentData.length - 1 ? '1px solid #eee' : 'none',
                  ...(index === 0 && { borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }),
                  ...(index === skillDevelopmentData.length - 1 && { borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }),
                }}
              >
                <h6 className="mb-2" style={{ color: '#333' }}>{skill.title}</h6>
                <p className="mb-0 small text-muted">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs-section mt-4">
        <div className="d-flex">
          <div
            className={`tab-item ${activeTab === 'About' ? 'active' : ''}`}
            onClick={() => setActiveTab('About')}
          >
            About
          </div>
          <div
            className={`tab-item ${activeTab === 'Details' ? 'active' : ''}`}
            onClick={() => setActiveTab('Details')}
          >
            Details
          </div>
        </div>
        <hr className="mt-0" />
      </div>

      <div className="price-tiers-section mt-4">
        <div className="row g-4">
          {priceTiers.map((tier, index) => (
            <div key={index} className="col-md-4">
              <div
                className="rounded-4 p-4 h-100 text-center shadow-sm"
                style={{ backgroundColor: tier.bgColor }}
              >
                <h5>{tier.level}</h5>
                <div className="price-amount my-3">{tier.price}</div>
                <button className="btn btn-outline-primary rounded-pill w-100" onClick={() => handleGetStarted(tier)}>
                  Get Started
                </button>
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
                    <span>Snacks Provided</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PslePowerCamp;