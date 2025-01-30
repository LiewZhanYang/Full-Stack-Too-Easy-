import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar() {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMemberActive, setIsMemberActive] = useState(false);

  useEffect(() => {
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
  }, []);

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Small Toggle Button for Mobile */}
      <button
        className="btn btn-primary btn-sm position-fixed top-0 start-0 mt-2 ms-2 d-lg-none"
        type="button"
        onClick={() => setShowSidebar(true)}
        style={{ zIndex: 1050 }}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Sidebar as Offcanvas for Mobile */}
      <div
        className={`offcanvas-lg offcanvas-start ${showSidebar ? "show" : ""}`}
        style={{ width: "250px" }}
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close text-reset d-lg-none"
            aria-label="Close"
            onClick={() => setShowSidebar(false)}
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column h-100 bg-white border-end">
          {/* Logo Section */}
          <div className="flex-shrink-0 text-center p-3 border-bottom">
            <Link to="/dashboard">
              <img
                src="/mindsphere.png"
                alt="mindsphere"
                className="img-fluid"
                style={{ height: "32px" }}
              />
            </Link>
          </div>

          {/* Scrollable Navigation Section */}
          <div className="flex-grow-1 overflow-auto">
            <nav className="mt-3">
              <Link
                to="/dashboard"
                className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
              >
                <i className="bi bi-columns-gap me-2"></i>
                Dashboard
              </Link>

              {/* Programmes Dropdown */}
              <div className="mt-3">
                <button
                  onClick={() => toggleMenu("programmes")}
                  className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                >
                  <i className="bi bi-journal-text me-2"></i>
                  Programmes
                  <i
                    className={`bi ${
                      expandedMenu === "programmes"
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    } ms-auto`}
                  ></i>
                </button>
                {expandedMenu === "programmes" && (
                  <div className="ps-4">
                    <Link
                      to="/workshopPrice"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Workshops
                    </Link>
                    <Link
                      to="/camps"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Camps
                    </Link>
                    <Link
                      to="/labs"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Labs
                    </Link>
                    <Link
                      to="/professionals"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Professionals
                    </Link>
                  </div>
                )}
              </div>

              {/* Forum Dropdown */}
              <div className="mt-3">
                <button
                  onClick={() => toggleMenu("forum")}
                  className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                >
                  <i className="bi bi-chat-dots me-2"></i>
                  Forum
                  <i
                    className={`bi ${
                      expandedMenu === "forum" ? "bi-chevron-up" : "bi-chevron-down"
                    } ms-auto`}
                  ></i>
                </button>
                {expandedMenu === "forum" && (
                  <div className="ps-4">
                    <Link
                      to="/forum/workshop"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Workshop
                    </Link>
                    <Link
                      to="/forum/camp"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Camp
                    </Link>
                    <Link
                      to="/forum/lab"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Lab
                    </Link>
                  </div>
                )}
              </div>

              {/* Ticketing Section */}
              <Link
                to="/ticketing"
                className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent mt-3"
              >
                <i className="bi bi-ticket me-2"></i>
                Ticketing
              </Link>

              {/* Events Dropdown (Only for Members) */}
              {isMemberActive && (
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("events")}
                    className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                  >
                    <i className="bi bi-calendar-event me-2"></i>
                    Events
                    <i
                      className={`bi ${
                        expandedMenu === "events"
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      } ms-auto`}
                    ></i>
                  </button>
                  {expandedMenu === "events" && (
                    <div className="ps-4">
                      <Link
                        to="/webinars"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Webinars
                      </Link>
                      <Link
                        to="/precoaching"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        1 to 1 Coaching
                      </Link>
                    </div>
                  )}
                </div>
              )}
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
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
