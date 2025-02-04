import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    username: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        // Make a POST request to the backend /login endpoint
        const response = await axios.post("http://localhost:8000/login", {
          emailOrUsername: formData.username,
          password: formData.password,
        });

        const { token, user } = response.data;
        //localStorage.setItem("userId", user.id);
        // Store the token in localStorage or sessionStorage
        localStorage.setItem("token", token);
        //localStorage.setItem("adminId", user.id);

        // Store either adminId or userId based on the user type
        if (user.userType === "admin") {
          navigate("/AdminHome");
          localStorage.setItem("adminId", user.id);
        } else {
          navigate("/dashboard");
          localStorage.setItem("userId", user.id);
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Invalid username or password.");
      }
    } else {
      // Handle user signup logic (if implemented)
      try {
        const response = await axios.post("http://localhost:8000/customer", {
          Name: `${formData.firstName} ${formData.lastName}`,
          EmailAddr: formData.email,
          ContactNo: formData.phoneNumber,
          Password: formData.password,
          MemberStatus: "active", // Default status
          PfpPath: "", // Profile path
        });

        if (response.status === 201) {
          alert("Signup successful! You can now log in.");
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("Error during signup. Please try again.");
      }
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      username: "",
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
        <div
          className={`w-full ${
            isLogin ? "max-w-[360px]" : "max-w-[600px]"
          } px-8`}
        >
          <h2 className="text-3xl font-normal mb-8">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin ? (
              <>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.Username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f8f8] focus:outline-none text-sm"
                      placeholder="Username"
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
                    placeholder="Username or Email Address"
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
              {isLogin ? "NEXT" : "Let's go!"}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={toggleView}
                className="text-blue-600 hover:text-blue-700"
              >
                {isLogin ? "Sign up now" : "Login here"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
