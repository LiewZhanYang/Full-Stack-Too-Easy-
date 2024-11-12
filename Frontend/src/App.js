import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "./AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard.js";
import WorkshopPrice from "./components/WorkshopPrice.js";
import Camps from "./components/Camps";
import Labs from "./components/Labs";
import Professionals from "./components/Professionals";
import Webinars from "./components/Webinars";
import Profile from "./components/Profile";
import Payment from "./components/Payment";
import Login from "./components/Login.js";
import Booking from "./components/Booking.js";
import PreCoaching from "./components/PreCoaching.js";
import Coaching from "./components/Coaching.js";
import AdminHome from "./components/AdminHome.js";
import AdminViewProgram from "./components/AdminViewProgram.js";
import AdminViewSession from "./components/AdminViewSession.js";
import AdminEditSession from "./components/AdminEditSession.js";
import AdminCreateSession from "./components/AdminCreateSession.js";
import AdminViewPayment from "./components/AdminViewPayment.js";
import AdminConfirmPayment from "./components/AdminConfirmPayment.js";
import AdminCreateProgram from "./components/AdminCreateProgram.js";
import AdminEditProgram from "./components/AdminEditProgram.js";
import AdminEditTiming from "./components/AdminEditTiming.js";
import AdminCoaching from "./components/AdminCoaching.js";
import Chatbot from "./components/Chatbot.js";
import AdminSideBar from './components/AdminSidebar.js';
import "./App.css";


// Layout component to handle conditional rendering
function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase() === "/login";
  const isAdminPage = location.pathname.toLowerCase().startsWith("/admin");

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
      {isAdminPage ? <AdminSideBar /> : <Sidebar />}
      <main className="main-content">
        <div className="container-fluid p-4">{children}</div>
      </main>
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <AppProvider initialSessionName="Coding Workshop">
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  {/* Login route */}
                  <Route path="/login" element={<Login />} />
                  {/* Redirect root to dashboard */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  {/* Main routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/workshopPrice" element={<WorkshopPrice />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/camps" element={<Camps />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/professionals" element={<Professionals />} />
                  <Route path="/webinars" element={<Webinars />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/preCoaching" element={<PreCoaching />} />
                  <Route path="/coaching" element={<Coaching />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  {/* Admin routes */}
                  <Route path="/adminhome" element={<AdminHome />} />
                  <Route path="/admin-coaching" element={<AdminCoaching />} />
                  <Route
                    path="/admin-view-program"
                    element={<AdminViewProgram />}
                  />
                  <Route
                    path="/admin-view-session/:id"
                    element={<AdminViewSession />}
                  />
                  <Route
                    path="/admin-edit-session/:id"
                    element={<AdminEditSession />}
                  />
                  <Route
                    path="/admin-create-session/:id"
                    element={<AdminCreateSession />}
                  />
                  <Route
                    path="/admin-view-payment"
                    element={<AdminViewPayment />}
                  />
                  <Route
                    path="/admin-confirm-payment/:id"
                    element={<AdminConfirmPayment />}
                  />
                  <Route
                    path="/admin-create-program"
                    element={<AdminCreateProgram />}
                  />
                  <Route
                    path="/admin-edit-program/:id"
                    element={<AdminEditProgram />}
                  />
                  <Route
                    path="/admin-edit-timing"
                    element={<AdminEditTiming />}
                  />
                  {/* Logout route redirects to login */}
                  <Route
                    path="/logout"
                    element={<Navigate to="/login" replace />}
                  />
                  {/* Fallback route for unmatched paths */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

// testing integrate
fetch("http://localhost:8000/payment")
  .then((response) => response.json())
  .then((data) => console.log(data)) // This should log the list of customers
  .catch((error) => console.error("Error:", error));

export default App;
