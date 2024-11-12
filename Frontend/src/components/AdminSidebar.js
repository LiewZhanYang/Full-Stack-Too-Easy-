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
                className="d-flex align-items-center px-3 py-2 text-dark fw-bold text-decoration-none"
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
                      to="/"
                      className="d-block py-1 text-dark text-decoration-none"
                    >
                      View All
                    </Link>
                    <Link
                      to="/"
                      className="d-block py-1 text-dark text-decoration-none"
                    >
                      Create
                    </Link>
                    <Link
                      to="/"
                      className="d-block py-1 text-dark text-decoration-none"
                    >
                      Update
                    </Link>
                    <Link
                      to="/"
                      className="d-block py-1 text-dark text-decoration-none"
                    >
                      Delete
                    </Link>
                  </div>
                )}
              </div>

              {/* Events Dropdown */}
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
                      to="/"
                      className="d-block py-1 text-dark text-decoration-none"
                    >
                      Invoice Confirmation
                    </Link>
                    <Link
                      to="/"
                      className="d-block py-1 text-dark text-decoration-none"
                    >
                      Edit Session Registration
                    </Link>
                    <Link
                      to="/"
                      className="d-block py-1 text-dark text-decoration-none"
                    >
                      Order History
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
