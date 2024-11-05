import React, { useState, useEffect } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';  

function Payment() {  
  const location = useLocation();  
  const navigate = useNavigate();  
  const { tier, price } = location.state || {};  

  const [activeTab, setActiveTab] = useState('Overview');  
  const [childrenCount, setChildrenCount] = useState('2 Children');  
  const [firstChildLunch, setFirstChildLunch] = useState('');  
  const [secondChildLunch, setSecondChildLunch] = useState('');  
  const [showPaynow, setShowPaynow] = useState(false);  
  const [selectedFile, setSelectedFile] = useState(null);  
  const [totalPrice, setTotalPrice] = useState(0);  
  const [isProcessing, setIsProcessing] = useState(false);  
  const [isConfirmed, setIsConfirmed] = useState(false);  

  const orderId = '12345678';  
  const currentDate = new Date().toLocaleDateString('en-GB');  

  useEffect(() => {  
    const numChildren = childrenCount === '1 Child' ? 1 : 2;  
    const pricePerChild = parseFloat(price?.replace('$', '') || 0);  
    setTotalPrice(pricePerChild * numChildren);  
  }, [childrenCount, price]);  

  const handleBack = () => {  
    navigate(-1);  
  };  

  const handleNext = () => {  
    if (activeTab === 'Overview') {  
      setActiveTab('Payment');  
    } else {  
      // Handle submission  
      console.log('Submit payment');  
    }  
  };  

  const handleDoneClick = () => {  
    setIsProcessing(true);  
    // Simulate processing time  
    setTimeout(() => {  
      setIsProcessing(false);  
      setIsConfirmed(true);  
    }, 2000);  
  };  

  const handleCloseModal = () => {  
    setShowPaynow(false);  
    setIsProcessing(false);  
    setIsConfirmed(false);  
  };  

  return (  
    <div className="p-4" style={{ backgroundColor: '#fff' }}>  
      <h1 className="fs-4 mb-4">Sign Up For Public Speaking Workshop</h1>  

      <div className="mb-4" style={{ borderBottom: '1px solid #dee2e6' }}>  
        <div className="d-flex gap-4">  
          <div  
            className={`pb-2`}  
            style={{  
              cursor: 'pointer',  
              borderBottom: activeTab === 'Overview' ? '2px solid #000' : 'none',  
              marginBottom: '-1px'  
            }}  
            onClick={() => setActiveTab('Overview')}  
          >  
            Overview  
          </div>  
          <div  
            className={`pb-2`}  
            style={{  
              cursor: 'pointer',  
              borderBottom: activeTab === 'Payment' ? '2px solid #000' : 'none',  
              marginBottom: '-1px'  
            }}  
            onClick={() => setActiveTab('Payment')}  
          >  
            Payment  
          </div>  
        </div>  
      </div>  

      {activeTab === 'Overview' && (  
        <div className="mb-5">  
          <div className="d-flex gap-5 mb-4">  
            <div>  
              <div>Date:</div>  
              <div>April 4th-7th</div>  
            </div>  
            <div>  
              <div>Time (for all days):</div>  
              <div>10:00-18:00</div>  
            </div>  
            <div>  
              <div>Location:</div>  
              <div>1 Clarke Quay</div>  
            </div>  
          </div>  

          <div className="mb-4">  
            <div className="mb-2">  
              <img src="/path-to-icon" alt="" className="me-2" style={{width: '16px', height: '16px'}}/>  
              Select child attending:  
            </div>  
            <select  
              value={childrenCount}  
              onChange={(e) => setChildrenCount(e.target.value)}  
              className="form-select"  
              style={{ maxWidth: '300px' }}  
            >  
              <option value="1 Child">1 Child</option>  
              <option value="2 Children">2 Children</option>  
            </select>  
          </div>  

          <div className="mb-3">  
            <div className="mb-2">Please select a lunch option (1st Child):</div>  
            <select  
              value={firstChildLunch}  
              onChange={(e) => setFirstChildLunch(e.target.value)}  
              className="form-select"  
              style={{ maxWidth: '300px' }}  
            >  
              <option value="">Select lunch option</option>  
              <option value="chicken">Chicken Rice</option>  
              <option value="fish">Fish & Chips</option>  
              <option value="veggie">Vegetarian</option>  
            </select>  
          </div>  

          {childrenCount === '2 Children' && (  
            <div className="mb-3">  
              <div className="mb-2">Please select a lunch option (2nd Child):</div>  
              <select  
                value={secondChildLunch}  
                onChange={(e) => setSecondChildLunch(e.target.value)}  
                className="form-select"  
                style={{ maxWidth: '300px' }}  
              >  
                <option value="">Select lunch option</option>  
                <option value="chicken">Chicken Rice</option>  
                <option value="fish">Fish & Chips</option>  
                <option value="veggie">Vegetarian</option>  
              </select>  
            </div>  
          )}  
        </div>  
      )}  

      {activeTab === 'Payment' && (  
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
                    <p className="mb-0">{currentDate}</p>  
                  </div>  
                </div>  
              </div>  

              <div className="mb-3">  
                <small className="text-muted">Programme</small>  
                <p className="mb-0">Public Speaking Workshop x{childrenCount}</p>  
              </div>  

              <div className="mb-3">  
                <small className="text-muted">Price Details</small>  
                <div className="p-3 bg-light rounded">  
                  <div className="d-flex justify-content-between mb-2">  
                    <span>Price per child:</span>  
                    <span>{price}</span>  
                  </div>  
                  <div className="d-flex justify-content-between mb-2">  
                    <span>Number of children:</span>  
                    <span>{childrenCount === '1 Child' ? '1' : '2'}</span>  
                  </div>  
                  <div className="d-flex justify-content-between fw-bold pt-2 border-top">  
                    <span>Total Amount:</span>  
                    <span>${totalPrice.toFixed(2)}</span>  
                  </div>  
                </div>  
              </div>  

              <button  
                onClick={() => setShowPaynow(true)}  
                className="btn btn-outline-secondary w-100 mt-3"  
              >  
                Show PayNow QR  
              </button>  
            </div>  
          </div>  

          <div className="col-md-6">  
            <div className="mb-4">  
              <h3 className="fs-5 mb-3">Upload screenshot of payment</h3>  
              <div className="border border-2 border-dashed rounded p-4">  
                <div className="text-center">  
                  {selectedFile ? (  
                    <div>  
                      <p className="small text-muted mb-1">{selectedFile.name}</p>  
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

      {/* QR Code Modal */}  
      {showPaynow && (  
        <>  
          <div   
            className="modal-backdrop fade show"   
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}  
          ></div>  
          <div className="modal fade show d-block" style={{ zIndex: 1056 }}>  
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>  
              <div className="modal-content">  
                <div className="modal-body p-4">  
                  {isProcessing ? (  
                    // Processing State  
                    <div className="text-center">  
                      <div className="text-center mb-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60px' }}>  
                        <img   
                          src="/mindsphere.png"   
                          alt="Mindsphere"   
                          className="img-fluid"   
                          style={{ height: '45px' }}  
                        />  
                      </div>  
                      <h5 className="mb-4">Processing Payment...</h5>  
                      <div className="spinner-border text-warning" role="status">  
                        <span className="visually-hidden">Loading...</span>  
                      </div>  
                    </div>  
                  ) : isConfirmed ? (  
                    // Confirmed State  
                    <div className="text-center">  
                      <div className="text-center mb-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60px' }}>  
                        <img   
                          src="/mindsphere.png"   
                          alt="Mindsphere"   
                          className="img-fluid"   
                          style={{ height: '45px' }}  
                        />  
                      </div>  
                      <div className="mb-3">  
                        <span className="text-success" style={{ fontSize: '48px' }}>✓</span>  
                      </div>  
                      <h5 className="mb-3">Payment received!</h5>  
                      <p className="text-muted mb-4">  
                        1-2 business days<br />  
                        for payment confirmation and<br />  
                        invoice will be sent to you.  
                      </p>  
                      <button  
                        onClick={handleCloseModal}  
                        className="btn"  
                        style={{   
                          backgroundColor: '#333333',  
                          color: '#fff',  
                          padding: '10px 0',  
                          border: 'none',  
                          borderRadius: '4px',  
                          fontWeight: '500',  
                          width: '100%'  
                        }}  
                      >  
                        Close Window  
                      </button>  
                    </div>  
                  ) : (  
                    // Initial QR Code State  
                    <>  
                      <div className="text-center mb-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60px' }}>  
                        <img   
                          src="/mindsphere.png"   
                          alt="Mindsphere"   
                          className="img-fluid"   
                          style={{ height: '45px' }}  
                        />  
                      </div>  
                      
                      <h5 className="text-center mb-3">Pay via Paynow</h5>  
                      
                      <p className="text-center small text-muted mb-4">  
                        Please include the order ID in the comments/remarks/reference number as shown in the screenshot or payment may be rejected.  
                      </p>  

                      <div className="text-center mb-4">  
                        <div   
                          className="mx-auto d-flex align-items-center justify-content-center"  
                          style={{  
                            width: '200px',   
                            height: '200px',  
                            border: '1px solid #dee2e6',  
                            borderRadius: '8px',  
                            backgroundColor: '#fff'  
                          }}  
                        >  
                          <img   
                            src="/qrcode.png"  
                            alt="PayNow QR Code"  
                            style={{  
                              width: '180px',  
                              height: '180px'  
                            }}  
                          />  
                        </div>  
                      </div>  

                      <div className="text-center mb-4">  
                        <p className="fw-bold mb-0">Total Amount: ${totalPrice.toFixed(2)}</p>  
                      </div>  

                      <button  
                        onClick={handleDoneClick}  
                        className="btn w-100"  
                        style={{   
                          backgroundColor: '#DFB301',  
                          color: '#000',  
                          padding: '10px 0',  
                          border: 'none',  
                          borderRadius: '4px',  
                          fontWeight: '500'  
                        }}  
                      >  
                        Done  
                      </button>  
                    </>  
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
          onClick={handleNext}  
          className="btn"  
          style={{ backgroundColor: '#FFC107', color: '#000' }}  
        >  
          {activeTab === 'Overview' ? 'Next' : 'Submit'}  
        </button>  
      </div>  
    </div>  
  );  
}  

export default Payment;