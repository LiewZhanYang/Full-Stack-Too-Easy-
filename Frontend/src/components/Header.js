import React from "react";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - adjusted with pl-0 for leftmost positioning */}
          <div className="flex-shrink-0 pl-0">
            <span>
              <img
                src="/mindsphere.png"
                alt="mindsphere"
                className="h-12" // Adjust height as needed
              />
            </span>
          </div>

          {/* Navigation Items - adjusted spacing and styling */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {" "}
              {/* Increased spacing */}
              <span className="text-gray-700 text-sm">Home</span>
              <span className="text-gray-700 text-sm">About Us</span>
              <span className="text-gray-700 text-sm">CSR</span>
              {/* Dropdown buttons with caret */}
              <div className="relative">
                <button className="text-gray-700 text-sm flex items-center">
                  Programmes
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <button className="text-gray-700 text-sm flex items-center">
                  Media
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {/* Updated CTA button styling - replaced Link with span */}
              <span className="bg-[#F4B223] text-white px-6 py-2 rounded text-sm font-medium">
                Get started today
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
