import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import '../App.css';  

function WorkshopPrice() {  
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
      duration: "3.5 days",  
      bgColor: "#e0f7fa"  
    },  
    {  
      level: "Intermediate",  
      price: "$275",  
      classSize: "10-15",  
      duration: "3.5 days",  
      bgColor: "#e8f5e9"  
    },  
    {  
      level: "Advanced",  
      price: "$340",  
      classSize: "5-10",  
      duration: "3.5 days",  
      bgColor: "#f3e5f5"  
    }  
  ];  

  return (  
    <div className="workshop-container">  
      {/* Hero Section */}  
      <div className="hero-section position-relative">  
        <img  
          src={"/publickid.png"}  
          alt="Public Speaking"  
          className="w-100"  
          style={{ height: '400px', objectFit: 'cover', objectPosition: 'center' }}  
        />  
        <div className="hero-content position-absolute start-0 bottom-0 w-100 p-4">  
          <h1 className="text-white mb-3">Public Speaking Workshop</h1>  
        </div>  

        {/* Course Details Box */}  
        <div className="course-details-box position-absolute bg-white rounded-3 shadow-sm"  
          style={{ width: '300px', right: '20px', top: '50%', transform: 'translateY(-50%)', padding: '20px' }}>  
          <ul className="list-unstyled mb-3">  
            <h1>Join this Course Today!</h1>  
            <li className="mb-2">• Join this course now!</li>  
            <li className="mb-2">• Save LAST WARNING!</li>  
            <li className="mb-2">• Enjoy my full education!</li>  
            <li className="mb-2">• Improve your art skills!</li>  
            <li className="mb-2">• Having change public broadcast!</li>  
          </ul>  
          <button className="btn btn-primary w-100 rounded-pill">Learn More</button>  
        </div>  

        {/* Skibidi Boxes - Removed inline bottom style */}  
        <div className="skibidi-section position-absolute w-100">  
          <div className="d-flex justify-content-center">  
            {[1, 2, 3, 4].map((_, index) => (  
              <div  
                key={index}  
                className="skibidi-box bg-white p-3 flex-grow-1"  
                style={{  
                  borderRight: index !== 3 ? '1px solid #eee' : 'none',  
                  ...(index === 0 && { borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }),  
                  ...(index === 3 && { borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }),  
                }}  
              >  
                <h6 className="mb-2" style={{ color: '#333' }}>sigma skibidi doo</h6>  
                <p className="mb-0 small text-muted">hi archer lowenhaupt worked liked</p>  
              </div>  
            ))}  
          </div>  
        </div>  
      </div>  

      {/* Navigation Tabs */}  
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

      {/* Price Tiers */}  
      <div className="price-tiers-section mt-4">  
        <h4 className="mb-4">Price Tiers</h4>  
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

export default WorkshopPrice;