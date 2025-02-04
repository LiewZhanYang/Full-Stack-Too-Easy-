import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StripePayment from "./StripePayment";
import axios from "axios";
const lunchOptionMapping = {
  chicken: 1,
  fish: 2,
  veggie: 3,
};
// Helper function to calculate age from DOB
const calculateAge = (dob) => {
  if (!dob) return "Unknown";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { programId, price } = location.state || {};
  console.log("Program ID:", programId);

  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [programName, setProgramName] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [childrenCount, setChildrenCount] = useState("2 Children");
  const [firstChildLunch, setFirstChildLunch] = useState("");
  const [secondChildLunch, setSecondChildLunch] = useState("");
  const [showPaynow, setShowPaynow] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMemberActive, setIsMemberActive] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
  
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
  
    const fetchSessions = async () => {
      try {
        console.log("Fetching Sessions for Program ID:", programId);
        console.log("Tier Selected:", location.state.tier);
    
        const response = await axios.get(
          `http://localhost:8000/session/program/${programId}`,
          { params: { tier: location.state.tier } }
        );
    
        setSessions(response.data);
        console.log("Sessions fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    
    
  
    const fetchProgramName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/program/${programId}`
        );
        console.log("Program response:", response);
        setProgramName(response.data.ProgramName);
      } catch (error) {
        console.error("Error fetching program name:", error);
      }
    };
  
    const fetchChildren = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
    
      try {
        // Fetch children for the user
        const childrenResponse = await axios.get(
          `http://localhost:8000/children/${userId}`
        );
    
        if (!childrenResponse.data || childrenResponse.data.length === 0) {
          console.warn("No children found for this user.");
          setChildren([]); // Reset children state if no data found
          return;
        }
    
        console.log("Children fetched:", childrenResponse.data);
    
        // Set children without signed-up sessions initially
        setChildren(childrenResponse.data);
      } catch (error) {
        console.error("Error fetching children:", error);
        setChildren([]); // Reset children state in case of an error
      }
    };
    
    const fetchSignups = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
    
      try {
        // Fetch signups for the user
        const signupResponse = await axios.get(
          `http://localhost:8000/signup/${userId}`
        );
    
        const existingSignups = signupResponse.data || [];
        console.log("Existing Signups:", existingSignups);
    
        // Update children with signed-up sessions
        setChildren((prevChildren) =>
          prevChildren.map((child) => {
            const signedUpSessions = existingSignups
              .filter((signup) => signup.ChildID === child.ChildID)
              .map((signup) => signup.SessionID); // Extract only SessionIDs
    
            return { ...child, signedUpSessions };
          })
        );
      } catch (error) {
        console.error("Error fetching signups:", error);
      }
    };
    
    
  
    fetchSessions();
    fetchChildren();
    fetchProgramName();
    fetchSignups();
  }, [programId]);
  
  useEffect(() => {
    const pricePerChild = parseFloat(price?.replace("$", "") || 0);
    setTotalPrice(pricePerChild * selectedChildren.length);
  }, [selectedChildren, price]);

  const handleChildSelection = (childId) => {
    setSelectedChildren((prevSelected) => {
      const existingChild = children.find((child) => child.ChildID === childId);
  
      if (!existingChild) return prevSelected; // Safety check
  
      if (prevSelected.some((child) => child.ChildID === childId)) {
        // Remove child if already selected
        return prevSelected.filter((child) => child.ChildID !== childId);
      }
  
      // Add child with signedUpSessions included
      return [...prevSelected, { ...existingChild }];
    });
  };
  

  const handleLunchOptionChange = (childId, lunchOption) => {
    setSelectedChildren((prevSelected) =>
      prevSelected.map((child) =>
        child.ChildID === childId
          ? { ...child, lunchOption } // Update the `lunchOption` directly
          : child
      )
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePaymentSubmit = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User is not authenticated.");
      return;
    }

    if (!selectedFile) {
      alert("Please upload a screenshot of the payment.");
      return;
    }

    if (!selectedSession) {
      alert("Please select a session.");
      return;
    }

    if (selectedChildren.length === 0) {
      alert("Please select at least one child.");
      return;
    }

    setShowProcessing(true);
    setIsProcessing(true);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("file", selectedFile); // Add the file
      formData.append("InvoiceID", Math.floor(100000 + Math.random() * 900000)); // Generate a numeric InvoiceID
      formData.append("Amount", totalPrice);
      formData.append("CreatedAt", new Date().toISOString());
      formData.append("Status", "Pending");
      formData.append("InvoicePath", "default.png"); // You can change this if necessary
      formData.append("SessionID", selectedSession?.SessionID);
      formData.append("PaidBy", userId);
      // Convert lunch options to numeric IDs before submitting
      formData.append(
        "SelectedChildren",
        JSON.stringify(
          selectedChildren.map((child) => ({
            ChildID: child.ChildID,
            lunchOption: lunchOptionMapping[child.lunchOption] || null, // Convert to numeric ID
          }))
        )
      );

      // Send the FormData using axios
      const response = await axios.post(
        "http://localhost:8000/payment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle response
      if (response.data && response.data.OrderID) {
        setOrderId(response.data.OrderID);
        setIsConfirmed(true);
        console.log(
          "Payment submitted successfully. Order ID:",
          response.data.OrderID
        );

        // Create signups for selected children
        for (const child of selectedChildren) {
          const signUpDetails = {
            AccountID: parseInt(userId, 10),
            SessionID: selectedSession.SessionID,
            LunchOptionID: lunchOptionMapping[child.lunchOption] || null, // Use numeric ID
            ChildID: child.ChildID,
          };

          console.log("Creating signup for child:", signUpDetails);

          try {
            const signupResponse = await axios.post(
              `http://localhost:8000/signup/`,
              signUpDetails
            );

            if (signupResponse.data && signupResponse.data.success) {
              console.log(
                "Signup created successfully:",
                signupResponse.data.signUpId
              );
            } else {
              throw new Error("Signup creation failed");
            }
          } catch (error) {
            console.error(
              "Error creating signup for child:",
              child.ChildID,
              error
            );
            alert(`Failed to create signup for child: ${child.ChildID}.`);
          }
        }

        alert("Payment submitted and signups created successfully!");

        navigate('/dashboard');
      } else {
        throw new Error("Order ID was not returned in the response data.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        alert(
          `Failed to submit payment or create signup. Server responded with: ${error.response.data.message}`
        );
      } else if (error.request) {
        console.error("No response from server. Request was:", error.request);
        alert("Failed to submit payment. No response from server.");
      } else {
        console.error("Unexpected error:", error.message);
        alert(
          `Failed to submit payment or create signup. Error: ${error.message}`
        );
      }
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  const discountedPrice = isMemberActive
    ? `$${(parseFloat(price.replace("$", "")) * 0.9).toFixed(2)}`
    : price;

  const handleCloseModal = () => {
    setShowPaynow(false);
    setShowProcessing(false);
    setIsProcessing(false);
    setIsConfirmed(false);
  };

  return (
    <div className="p-4" style={{ backgroundColor: "#fff" }}>
      <h1 className="fs-4 mb-4">Sign Up For {programName || "Program"}</h1>

      <div className="mb-4" style={{ borderBottom: "1px solid #dee2e6" }}>
        <div className="d-flex gap-4">
          <div
            className={`pb-2`}
            style={{
              cursor: "pointer",
              borderBottom:
                activeTab === "Overview" ? "2px solid #FFC107" : "none",
              marginBottom: "-1px",
            }}
            onClick={() => setActiveTab("Overview")}
          >
            Overview
          </div>
          <div
            className={`pb-2`}
            style={{
              cursor: "pointer",
              borderBottom:
                activeTab === "Payment" ? "2px solid #FFC107" : "none",
              marginBottom: "-1px",
            }}
            onClick={() => setActiveTab("Payment")}
          >
            Payment
          </div>
        </div>
      </div>

      {activeTab === "Overview" && (
        <div>
          <h3 className="fs-5 mb-3">Select a Session</h3>
          <div className="dropdown mb-4">
            <button
              className="btn btn-outline-secondary w-100 text-start"
              type="button"
              id="sessionDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedSession
                ? `${new Date(
                    selectedSession.StartDate
                  ).toLocaleDateString()} - ${new Date(
                    selectedSession.EndDate
                  ).toLocaleDateString()} - ${selectedSession.Time}`
                : "Select a Session"}
            </button>
            <ul className="dropdown-menu">
        {sessions.map((session) => {
          //  Check if any selected child has signed up for this session
          const isSessionDisabled = selectedChildren.some((child) =>
            child.signedUpSessions?.includes(session.SessionID)
          );

          console.log(
            `Session ${session.SessionID} Disabled? ${isSessionDisabled}`
          );

          return (
            <li key={session.SessionID}>
              <button
                className="dropdown-item"
                onClick={() => setSelectedSession(session)}
                disabled={isSessionDisabled} //  Disable already signed-up sessions
                style={{
                  color: isSessionDisabled ? "#d3d3d3" : "inherit",
                  pointerEvents: isSessionDisabled ? "none" : "auto",
                }}
              >
                {new Date(session.StartDate).toLocaleDateString()} -{" "}
                {new Date(session.EndDate).toLocaleDateString()} ({session.Location}){" "}
                {isSessionDisabled && "(Already signed up)"}
              </button>
            </li>
          );
        })}
      </ul>
          </div>

          <h3 className="fs-5 mb-3">Select Children Attending</h3>
          <div className="mb-4">
            {children.map((child) => (
              <div key={child.ChildID} className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`child-${child.ChildID}`}
                  checked={selectedChildren.some(
                    (c) => c.ChildID === child.ChildID
                  )}
                  onChange={() => handleChildSelection(child.ChildID)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`child-${child.ChildID}`}
                >
                  {child.Name} (Age: {calculateAge(child.DOB)})
                </label>

                {selectedChildren.some((c) => c.ChildID === child.ChildID) && (
                  <div className="mt-2">
                    <label className="form-label">Lunch Option:</label>
                    <select
                      className="form-select"
                      value={
                        selectedChildren.find(
                          (c) => c.ChildID === child.ChildID
                        )?.lunchOption || ""
                      }
                      onChange={(e) =>
                        handleLunchOptionChange(child.ChildID, e.target.value)
                      }
                    >
                      <option value="">Select lunch option</option>
                      <option value="chicken">Chicken Rice</option>
                      <option value="fish">Fish & Chips</option>
                      <option value="veggie">Vegetarian</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Payment" && (
        <div className="row">
          <div className="col-md-6">
            <div className="mb-4">
              <h3 className="fs-5 mb-3">Order Summary</h3>
              <div className="mb-3">
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Order ID</small>
                    <p className="mb-0">{orderId}</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Date</small>
                    <p className="mb-0">
                      {selectedSession
                        ? `${new Date(
                            selectedSession.StartDate
                          ).toLocaleDateString()} - ${new Date(
                            selectedSession.EndDate
                          ).toLocaleDateString()}`
                        : "Select a session"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Location</small>
                <p className="mb-0">
                  {selectedSession?.Location || "Select a session"}
                </p>
              </div>

              <div className="mb-3">
                <small className="text-muted">Time</small>
                <p className="mb-0 fw-bold">
                  {selectedSession?.Time || "Select a session"}
                </p>
              </div>

              <div className="mb-3">
                <small className="text-muted">Programme</small>
                <p className="mb-0">
                  {programName} x {selectedChildren.length}
                </p>
              </div>

              <div className="mb-3">
                <small className="text-muted">Price Details</small>
                <div className="p-3 bg-light rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Price per child:</span>
                    <span>
                      {isMemberActive && (
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "red",
                            marginRight: "10px",
                          }}
                        >
                          {price}
                        </span>
                      )}
                      {isMemberActive
                        ? `$${(
                            parseFloat(price.replace("$", "")) * 0.9
                          ).toFixed(2)}`
                        : price}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Number of children:</span>
                    <span>{selectedChildren.length}</span>
                  </div>
                  {isMemberActive && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Membership Discount:</span>
                      <span>-10%</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                    <span>Total Amount:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setShowStripePayment(true)}
                    className="btn btn-primary"
                  >
                    Pay with Stripe
                  </button>
                  {showStripePayment && (
                    <StripePayment
                      totalPrice={totalPrice}
                      programId={programId}
                      selectedChildren={selectedChildren}
                      SessionID={selectedSession?.SessionID}
                      UserID={localStorage.getItem("userId")}
                    />
                  )}
                  <button
                    onClick={() => setShowPaynow(true)}
                    className="btn btn-outline-secondary w-100 mt-3"
                  >
                    Show PayNow QR
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
          {/* QR Code Modal */}
          {showPaynow && (
            <>
              <div
                className="modal-backdrop fade show"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              ></div>
              <div className="modal fade show d-block" style={{ zIndex: 1056 }}>
                <div
                  className="modal-dialog modal-dialog-centered"
                  style={{ maxWidth: "400px" }}
                >
                  <div className="modal-content">
                    <div className="modal-body p-4">
                      <h5 className="text-center mb-3">Pay via PayNow</h5>
                      <p className="text-center small text-muted mb-4">
                        Please include the order ID in the payment reference or
                        it may be rejected.
                      </p>
                      <div className="text-center mb-4">
                        <div
                          className="mx-auto"
                          style={{
                            width: "200px",
                            height: "200px",
                            border: "1px solid #dee2e6",
                            borderRadius: "8px",
                          }}
                        >
                          <img
                            src="/qrcode.png"
                            alt="PayNow QR Code"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </div>
                      <p className="text-center fw-bold">
                        Total Amount: ${totalPrice.toFixed(2)}
                      </p>
                      <button
                        onClick={handleCloseModal}
                        className="btn w-100 mt-3"
                        style={{ backgroundColor: "#FFC107", color: "#000" }}
                      >
                        Close Window
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="col-md-6">
            <div className="mb-4">
              <h3 className="fs-5 mb-3">Upload screenshot of payment</h3>
              <div className="border border-2 border-dashed rounded p-4">
                <div className="text-center">
                  {selectedFile ? (
                    <div>
                      <p className="small text-muted mb-1">
                        {selectedFile.name}
                      </p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="btn btn-link text-danger p-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload fs-1 text-muted"></i>
                      <div className="mt-2">
                        <label className="btn btn-link text-primary">
                          Choose File
                          <input
                            type="file"
                            className="d-none"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProcessing && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          ></div>
          <div className="modal fade show d-block" style={{ zIndex: 1056 }}>
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "400px" }}
            >
              <div className="modal-content">
                <div className="modal-body p-4">
                  {isProcessing ? (
                    <div className="text-center">
                      <div
                        className="text-center mb-4 d-flex justify-content-center align-items-center"
                        style={{ minHeight: "60px" }}
                      >
                        <img
                          src="/mindsphere.png"
                          alt="Mindsphere"
                          className="img-fluid"
                          style={{ height: "45px" }}
                        />
                      </div>
                      <h5 className="mb-4">Processing Payment...</h5>
                      <div
                        className="spinner-border text-warning"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : isConfirmed ? (
                    <div className="text-center">
                      <div className="mb-3 d-flex justify-content-center">
                        <img
                          src="/mindsphere.png"
                          alt="Mindsphere"
                          className="img-fluid"
                          style={{ height: "45px" }}
                        />
                      </div>
                      <div className="mb-3 d-flex justify-content-center">
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#4CAF50",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-check"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      </div>
                      <h5 className="mb-3">Payment received!</h5>
                      <p className="text-muted mb-4">
                        1-2 business days
                        <br />
                        for payment confirmation and
                        <br />
                        invoice will be sent to you.
                      </p>
                      <button
                        onClick={handleCloseModal}
                        className="btn"
                        style={{
                          backgroundColor: "#333333",
                          color: "#fff",
                          padding: "10px 0",
                          border: "none",
                          borderRadius: "4px",
                          fontWeight: "500",
                          width: "100%",
                        }}
                      >
                        Close Window
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button
          onClick={handleBack}
          className="btn btn-link text-dark text-decoration-none"
        >
          Back
        </button>
        <button
          onClick={
            activeTab === "Overview"
              ? () => setActiveTab("Payment")
              : handlePaymentSubmit
          }
          className="btn"
          style={{ backgroundColor: "#FFC107", color: "#000" }}
        >
          {activeTab === "Overview" ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Payment;
