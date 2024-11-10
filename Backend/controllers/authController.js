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

    // Try to find the user in Customer table first
    user = await Customer.findCustomerByEmailOrUsername(emailOrUsername);
    if (user) {
      userType = "customer";
    } else {
      // If not found in Customer, search in Admin table
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

    // Generate JWT token
    const token = generateToken({
      id: user.AccountID || user.AdminID,
      userType,
    });

    // Respond with token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.AccountID || user.AdminID,
        emailOrUsername: emailOrUsername,
        userType,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

module.exports = { login };
