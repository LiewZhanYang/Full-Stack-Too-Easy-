import React from 'react';  
import { Link } from 'react-router-dom';  


function Header() {  
  return (  
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">  
      <nav className="container mx-auto px-6 lg:px-8">  
        <div className="flex justify-between items-center h-16">  
          {/* Logo - adjusted with pl-0 for leftmost positioning */}  
          <div className="flex-shrink-0 pl-0">  
            <Link to="/">  
              <img   
                src="/mindsphere.png"   
                alt="mindsphere"   
                className="h-12" // Adjust height as needed  
              />  
            </Link>  
          </div>  
          
          {/* Navigation Items - adjusted spacing and styling */}  
          <div className="hidden md:block">  
            <div className="flex items-center space-x-8"> {/* Increased spacing */}  
              <Link to="/" className="text-gray-700 hover:text-gray-900 text-sm">Home</Link>  
              <Link to="/about" className="text-gray-700 hover:text-gray-900 text-sm">About Us</Link>  
              <Link to="/csr" className="text-gray-700 hover:text-gray-900 text-sm">CSR</Link>  
              
              {/* Dropdown buttons with caret */}  
              <div className="relative">  
                <button className="text-gray-700 hover:text-gray-900 text-sm flex items-center">  
                  Programmes  
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />  
                  </svg>  
                </button>  
              </div>  
              
              <div className="relative">  
                <button className="text-gray-700 hover:text-gray-900 text-sm flex items-center">  
                  Media  
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />  
                  </svg>  
                </button>  
              </div>  
              
              {/* Updated CTA button styling */}  
              <Link   
                to="/get-started"   
                className="bg-[#F4B223] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#e5a420] transition-colors"  
              >  
                Get started today  
              </Link>  
            </div>  
          </div>  
        </div>  
      </nav>  
    </header>  
  );  
}  

export default Header;