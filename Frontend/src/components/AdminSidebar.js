import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar() {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

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
            <Link to="/AdminHome">
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
                to="/AdminHome"
                className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
              >
                <i className="bi bi-columns-gap me-2"></i>
                Home
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
                      to="/admin-view-program"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      View All
                    </Link>
                    <Link
                      to="/admin-create-program"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>

              {/* Webinars Dropdown */}
              <div className="mt-3">
                <button
                  onClick={() => toggleMenu("webinars")}
                  className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                >
                  <i className="bi bi-camera-video me-2"></i>
                  Webinars
                  <i
                    className={`bi ${
                      expandedMenu === "webinars"
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    } ms-auto`}
                  ></i>
                </button>
                {expandedMenu === "webinars" && (
                  <div className="ps-4">
                    <Link
                      to="/admin-view-webinars"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      View All
                    </Link>
                    <Link
                      to="/admin-create-webinar"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Coaching Dropdown */}
              <div className="mt-3">
                <button
                  onClick={() => toggleMenu("coaching")}
                  className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                >
                  <i className="bi bi-people me-2"></i>
                  Coaching
                  <i
                    className={`bi ${
                      expandedMenu === "coaching"
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    } ms-auto`}
                  ></i>
                </button>
                {expandedMenu === "coaching" && (
                  <div className="ps-4">
                    <Link
                      to="/admin-view-booking"
                      className="d-block py-1 text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      View All Bookings
                    </Link>
                  </div>
                )}
                {/* Announcement Dropdown */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("announcement")}
                    className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                  >
                    <i className="bi bi-bell me-2"></i>
                    Announcement
                    <i
                      className={`bi ${
                        expandedMenu === "announcement"
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      } ms-auto`}
                    ></i>
                  </button>
                  {expandedMenu === "announcement" && (
                    <div className="ps-4">
                      <Link
                        to="/admin-view-announcement"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        View All
                      </Link>
                      <Link
                        to="/admin-create-announcement"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Create
                      </Link>
                    </div>
                  )}
                </div>
                {/* Registration Dropdown */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("events")}
                    className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                  >
                    <i className="bi bi-calendar-event me-2"></i>
                    Registration
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
                        to="/admin-view-payment"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Incoming Payments
                      </Link>
                    </div>
                  )}
                </div>
                {/* CMS (Customer Management System) Dropdown */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("cms")}
                    className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    CMS
                    <i
                      className={`bi ${
                        expandedMenu === "cms"
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      } ms-auto`}
                    ></i>
                  </button>
                  {expandedMenu === "cms" && (
                    <div className="ps-4">
                      <Link
                        to="/analytics"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Analytics Dashboard
                      </Link>
                      <Link
                        to="/admin-view-insights"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Insights Dashboard
                      </Link>
                    </div>
                  )}
                </div>
                {/* Ticketing Section */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleMenu("ticket")}
                    className="btn d-flex align-items-center w-100 text-dark fw-bold px-3 py-2 border-0 bg-transparent"
                  >
                    <i className="bi bi-ticket me-2"></i>
                    Ticketing
                    <i
                      className={`bi ${
                        expandedMenu === "ticket"
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      } ms-auto`}
                    ></i>
                  </button>
                  {expandedMenu === "ticket" && (
                    <div className="ps-4">
                      <Link
                        to="/admin-view-ticket"
                        className="d-block py-1 text-dark text-decoration-none"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Incoming Tickets
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom Profile and Logout Section */}
          <div className="flex-shrink-0 border-top mt-auto">
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
