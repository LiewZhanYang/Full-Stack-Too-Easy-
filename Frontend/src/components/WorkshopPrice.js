import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom'; 
import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';

import '../App.css';  
function WorkshopPrice() {  
  const { sessionName, setSessionName } = useContext(AppContext); 
  const [activeTab, setActiveTab] = useState('About');  
  const navigate = useNavigate();

  useEffect(() => {  
    // Set the session name to "Public Speaking Workshop"  
    setSessionName('Public Speaking Workshop');  
  }, [setSessionName]);  

  const handleGetStarted = (tier) => {  
    navigate('/payment', {  
      state: {  
        programId: tier.programId,
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
      programId: 1,
      programName: "Public Speaking Workshop - Beginner",
      price: "$204",  
      classSize: "15-20",  
      duration: "3.5 days",  
      lunchProvided: true,  
      bgColor: "#e0f7fa"  
    },  
    {  
      level: "Intermediate",  
      programId: 2,
      programName: "Public Speaking Workshop - Intermediate",
      price: "$275",  
      classSize: "10-15",  
      duration: "3.5 days",  
      lunchProvided: true,  
      bgColor: "#e8f5e9"  
    },  
    {  
      level: "Advanced",  
      programId: 3,
      programName: "Public Speaking Workshop - Advanced",
      price: "$340",  
      classSize: "5-10",  
      duration: "3.5 days",  
      lunchProvided: true,  
      bgColor: "#f3e5f5"  
    }  
  ];  
  // Unique skill development content  
  const skillDevelopmentData = [  
    {  
      title: "Personal Growth",  
      description: "Develop confidence and eloquence in public speaking."  
    },  
    {  
      title: "Presentation Skills",  
      description: "Learn how to captivate your audience with engaging presentations."  
    },  
    {  
      title: "Effective Communication",  
      description: "Enhance your ability to convey information clearly and persuasively."  
    },  
    {  
      title: "Dynamic Storytelling",  
      description: "Master the art of storytelling to make your speeches impactful."  
    }  
  ];  

  return (  
    <div className="workshop-container">  
      <div className="hero-section position-relative">  
        <img  
          src={"/img/workshops.jpg"}  
          alt="Public Speaking"  
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
            {sessionName} 
          </h1>  
        </div>  

        <div className="course-details-box position-absolute bg-white rounded-3 shadow-lg p-4">  
          <ul className="list-unstyled mb-3">  
            <h2 className="text-center fw-bold mb-3">Join this Course Today!</h2>  
            <li className="mb-2">• Join this course now!</li>  
            <li className="mb-2">• Save LAST WARNING!</li>  
            <li className="mb-2">• Enjoy my full education!</li>  
            <li className="mb-2">• Improve your art skills!</li>  
            <li className="mb-2">• Having change public broadcast!</li>  
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
                    <span>Lunch Provided</span>  
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

export default WorkshopPrice
