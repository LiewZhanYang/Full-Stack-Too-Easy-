import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';  

function Sidebar() {  
  const [expandedMenu, setExpandedMenu] = useState(null);  
  const navigate = useNavigate();  

  const toggleMenu = (menu) => {  
    setExpandedMenu(expandedMenu === menu ? null : menu);  
  };  

  const handleLogout = () => {  
    // Add any logout logic here if needed (e.g., clearing tokens)  
    navigate('/login');  
  };  

  return (  
    <div className="position-fixed h-100 bg-white border-end d-flex flex-column"  
         style={{ width: '274px', left: 0, top: 0 }}>  
      
      {/* Top Section with Logo */}  
      <div className="flex-shrink-0">  
        <div className="p-3 border-bottom text-center">  
          <img   
            src="/mindsphere.png"   
            alt="mindsphere"   
            className="img-fluid"   
            style={{ height: '32px' }}   
          />  
        </div>  
      </div>  

      {/* Scrollable Navigation Section */}  
      <div className="flex-grow-1 overflow-auto">  
        <nav className="mt-3">  
          <Link   
            to="/dashboard"   
            className="d-flex align-items-center px-3 py-2 text-dark fw-bold text-decoration-none"  
          >  
            <i className="bi bi-columns-gap me-2"></i>  
            Dashboard  
          </Link>  

          {/* Programmes Dropdown */}  
          <div className="mt-3">  
            <button  
              onClick={() => toggleMenu('programmes')}  
              className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"  
            >  
              <i className="bi bi-journal-text me-2"></i>  
              Programmes  
              <i   
                className={`bi ${  
                  expandedMenu === 'programmes' ? 'bi-chevron-up' : 'bi-chevron-down'  
                } ms-auto`}  
              ></i>  
            </button>  
            {expandedMenu === 'programmes' && (  
              <div className="ps-4">  
                <Link   
                  to="/workshopPrice"   
                  className="d-block py-1 text-dark text-decoration-none"  
                >  
                  WorkshopPrice  
                </Link>  
                <Link   
                  to="/camps"   
                  className="d-block py-1 text-dark text-decoration-none"  
                >  
                  Camps  
                </Link>  
                <Link   
                  to="/labs"   
                  className="d-block py-1 text-dark text-decoration-none"  
                >  
                  Labs  
                </Link>  
                <Link   
                  to="/professionals"   
                  className="d-block py-1 text-dark text-decoration-none"  
                >  
                  Professionals  
                </Link>  
              </div>  
            )}  
          </div>  

          {/* Events Dropdown */}  
          <div className="mt-3">  
            <button  
              onClick={() => toggleMenu('events')}  
              className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"  
            >  
              <i className="bi bi-calendar-event me-2"></i>  
              Events  
              <i   
                className={`bi ${  
                  expandedMenu === 'events' ? 'bi-chevron-up' : 'bi-chevron-down'  
                } ms-auto`}  
              ></i>  
            </button>  
            {expandedMenu === 'events' && (  
              <div className="ps-4">  
                <Link   
                  to="/webinars"   
                  className="d-block py-1 text-dark text-decoration-none"  
                >  
                  Webinars  
                </Link>  
                <Link   
                  to="/coaching"   
                  className="d-block py-1 text-dark text-decoration-none"  
                >  
                  1 to 1 Coaching  
                </Link>  
              </div>  
            )}  
          </div>  
        </nav>  
      </div>  

      {/* Bottom Profile and Logout Section */}  
      <div className="flex-shrink-0 border-top mt-auto">  
        <Link   
          to="/profile"   
          className="d-flex align-items-center px-3 py-2 text-dark text-decoration-none"  
        >  
          <i className="bi bi-person me-2"></i>  
          Profile  
        </Link>  
        <div  
          onClick={handleLogout}  
          className="d-flex align-items-center px-3 py-2 text-dark text-decoration-none"  
          style={{ cursor: 'pointer' }}  
        >  
          <i className="bi bi-box-arrow-right me-2"></i>  
          Logout  
        </div>  
      </div>  
    </div>  
  );  
}  

export default Sidebar;