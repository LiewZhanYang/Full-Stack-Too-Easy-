// models/emailModel.js
const nodemailer = require("nodemailer");

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address from environment variable
    pass: process.env.GMAIL_PASS, // Your Gmail password or App Password from environment variable
  },
});

/**
 * Sends an email with the specified parameters.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} textContent - The content of the email.
 * @returns {object} - Response information about the email sending operation.
 */
const sendEmail = async (recipientEmail, subject, textContent) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipientEmail,
    subject,
    text: textContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
