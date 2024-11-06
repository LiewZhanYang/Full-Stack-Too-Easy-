// App.js  
import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';  
import Sidebar from './components/Sidebar';  
import Header from './components/Header';  
import Dashboard from './components/Dashboard.js';  
import WorkshopPrice from './components/WorkshopPrice.js';  
import Camps from './components/Camps';  
import Labs from './components/Labs';  
import Professionals from './components/Professionals';  
import Webinars from './components/Webinars';  
import Coaching from './components/PreCoaching.js';  
import Profile from './components/Profile';  
import Payment from './components/Payment';  
import Login from './components/Login.js'; 
import Booking from './components/Booking.js';
import PreCoaching from './components/PreCoaching.js';
import AdminHome from './components/AdminHome.js';
import AdminProgram from './components/AdminProgram.js';
import AdminViewSession from './components/AdminViewSession.js';
import AdminEditSession from './components/AdminEditSession.js';
import './App.css';  

// Layout component to handle conditional rendering  
function Layout({ children }) {  
  const location = useLocation();  
  const isLoginPage = location.pathname.toLowerCase() === '/login';  

  if (isLoginPage) {  
    return (  
      <>  
        <Header />  
        {children}  
      </>  
    );  
  }  

  return (  
    <div className="d-flex min-vh-100">  
      <Sidebar />  
      <main className="main-content">  
        <div className="container-fluid p-4">  
          {children}  
        </div>  
      </main>  
    </div>  
  );  
}  

function App() {  
  return (  
    <Router>  
      <Routes>  
        <Route path="/*" element={  
          <Layout>  
            <Routes>  
              {/* Login route */}  
              <Route path="/login" element={<Login />} />  
              
              {/* Redirect root to dashboard */}  
              <Route path="/" element={<Navigate to="/dashboard" replace />} />  
              
              {/* Main routes */}  
              <Route path="/dashboard" element={<Dashboard />} />  
              <Route path="/workshopPrice" element={<WorkshopPrice />} />  
              <Route path="/payment" element={<Payment />} />  
              <Route path="/camps" element={<Camps />} />  
              <Route path="/labs" element={<Labs />} />  
              <Route path="/professionals" element={<Professionals />} />  
              <Route path="/webinars" element={<Webinars />} />  
              <Route path="/coaching" element={<Coaching />} />  
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/booking" element={<Booking />} /> 
              <Route path="/preCoaching" element={<PreCoaching />} />

              {/* Admin routes */}
              <Route path="/adminhome" element={<AdminHome />} />
              <Route path="/adminprogram" element={<AdminProgram />} />
              <Route path="/admin-view-session/:id" element={<AdminViewSession />} />
              <Route path="/admin-edit-session/:id" element={<AdminEditSession />} />

              {/* Logout route redirects to login */}  
              <Route path="/logout" element={<Navigate to="/login" replace />} />  
              
              {/* Fallback route for unmatched paths */}  
              <Route path="*" element={<Navigate to="/dashboard" replace />} />  

            </Routes>  
          </Layout>  
        } />  
      </Routes>  
    </Router>  
  );  
}  

export default App;  

