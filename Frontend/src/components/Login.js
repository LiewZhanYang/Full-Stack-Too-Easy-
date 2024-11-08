import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  

function Login() {  
  const navigate = useNavigate();  
  const [isLogin, setIsLogin] = useState(true);  
  const [formData, setFormData] = useState({  
    firstName: '',  
    lastName: '',  
    email: '',  
    password: '',  
    phoneNumber: '',  
    username: ''  
  });  

  const handleInputChange = (e) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({  
      ...prev,  
      [name]: value  
    }));  
  };  

  const handleSubmit = (e) => {  
    e.preventDefault();  
    
    // Admin credentials check  
    if (isLogin) {  
      if (formData.username === 'admin' && formData.password === 'admin123') {  
        // Navigate to admin dashboard  
        navigate('/adminHome');  
      } else if (formData.username && formData.password) {  
        // Navigate to regular user dashboard  
        navigate('/dashboard');  
      }  
    } else if (!isLogin && Object.values(formData).every(field => field)) {  
      // Handle regular user signup  
      navigate('/dashboard');  
    }  
  };  

  const toggleView = () => {  
    setIsLogin(!isLogin);  
    setFormData({  
      firstName: '',  
      lastName: '',  
      email: '',  
      password: '',  
      phoneNumber: '',  
      username: ''  
    });  
  };  

  return (  
    <div className="flex h-screen">  
      {/* Left Side - Image */}  
      <div className="w-1/2">  
        <img  
          src="/loginpfp.jpg"  
          alt="Event"  
          className="object-cover w-full h-full"  
        />  
      </div>  

      {/* Right Side - Form */}  
      <div className="w-1/2 flex items-center justify-center bg-white">  
        <div className={`w-full ${isLogin ? 'max-w-[360px]' : 'max-w-[600px]'} px-8`}>  
          <h2 className="text-3xl font-normal mb-8">{isLogin ? 'Login' : 'Sign Up'}</h2>  
          
          <form onSubmit={handleSubmit} className="space-y-6">  
            {!isLogin ? (  
              <>  
                <div className="flex gap-4">  
                  <div className="flex-1">  
                    <input  
                      type="text"  
                      name="firstName"  
                      value={formData.firstName}  
                      onChange={handleInputChange}  
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"  
                      placeholder="First Name"  
                      required  
                    />  
                  </div>  
                  <div className="flex-1">  
                    <input  
                      type="text"  
                      name="lastName"  
                      value={formData.lastName}  
                      onChange={handleInputChange}  
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"  
                      placeholder="Last Name"  
                      required  
                    />  
                  </div>  
                </div>  

                <div>  
                  <input  
                    type="email"  
                    name="email"  
                    value={formData.email}  
                    onChange={handleInputChange}  
                    className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"  
                    placeholder="Email Address"  
                    required  
                  />  
                </div>  

                <div>  
                  <input  
                    type="password"  
                    name="password"  
                    value={formData.password}  
                    onChange={handleInputChange}  
                    className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"  
                    placeholder="Password"  
                    required  
                  />  
                </div>  

                <div>  
                  <input  
                    type="tel"  
                    name="phoneNumber"  
                    value={formData.phoneNumber}  
                    onChange={handleInputChange}  
                    className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"  
                    placeholder="Phone Number"  
                    required  
                  />  
                </div>  
              </>  
            ) : (  
              <>  
                <div>  
                  <input  
                    type="text"  
                    name="username"  
                    value={formData.username}  
                    onChange={handleInputChange}  
                    className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"  
                    placeholder="Username"  
                    required  
                  />  
                </div>  

                <div>  
                  <input  
                    type="password"  
                    name="password"  
                    value={formData.password}  
                    onChange={handleInputChange}  
                    className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"  
                    placeholder="Password"  
                    required  
                  />  
                </div>  
              </>  
            )}  

            <button  
              type="submit"  
              className="w-full bg-black text-white py-3 rounded-lg text-base font-normal mt-6"  
            >  
              {isLogin ? 'NEXT' : "Let's go!"}  
            </button>  

            <div className="text-center text-sm">  
              <span className="text-gray-600">  
                {isLogin ? "Don't have an account? " : "Already have an account? "}  
              </span>  
              <button  
                type="button"  
                onClick={toggleView}  
                className="text-blue-600 hover:text-blue-700"  
              >  
                {isLogin ? 'Sign up now' : 'Login here'}  
              </button>  
            </div>  
          </form>  
        </div>  
      </div>  
    </div>  
  );  
}  

export default Login;