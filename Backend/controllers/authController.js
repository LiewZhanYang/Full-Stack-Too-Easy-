const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");
const Admin = require("../models/admin");

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "1h",
  });
}

async function login(req, res) {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email/username and password." });
  }

  try {
    let user;
    let userType;
    let MemberStatus = null;  // Initialize memberStatus to null or a default value

    // Check the Customer table first
    user = await Customer.findCustomerByEmailOrUsername(emailOrUsername);
    if (user) {
      userType = "customer";
      // Check if customer has member_status 1 and assign it to memberStatus
      if (user.MemberStatus === 1) {
        MemberStatus = user.MemberStatus;
      }
    } else {
      // If not found in Customer, check the Admin table
      user = await Admin.findAdminByEmailOrUsername(emailOrUsername);
      if (user) {
        userType = "admin";
      }
    }

    // If user is not found in either table
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/username or password." });
    }

    // Directly compare plain text password
    if (password !== user.Password) {
      return res
        .status(401)
        .json({ message: "Invalid email/username or password." });
    }

    // Prepare payload for JWT token
    const tokenPayload = {
      id: user.AccountID || user.AdminID,
      userType,
    };

    // Add memberStatus to payload if userType is customer and memberStatus is 1
    if (userType === "customer" && MemberStatus === 1) {
      tokenPayload.MemberStatus = MemberStatus;
    }

    // Generate JWT token
    const token = generateToken(tokenPayload);

    // Respond with token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.AccountID || user.AdminID,
        emailOrUsername: emailOrUsername,
        userType,
        ...(userType === "customer" && MemberStatus === 1 && { MemberStatus }),
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

module.exports = { login };
