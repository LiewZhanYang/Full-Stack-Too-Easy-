const nodemailer = require("nodemailer");

// Create a transporter using Gmail SMTP server
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address from environment variable
    pass: process.env.GMAIL_PASS, // Your Gmail password or App Password from environment variable
  },
});

// Function to send an email notification
exports.sendEmailNotification = async (recipientEmail, filename) => {
  // Email options with dynamic recipient and message content
  const mailOptions = {
    from: process.env.GMAIL_USER, // Sender's address from environment variable
    to: recipientEmail, // Recipient's address
    subject: "New File Uploaded to S3", // Subject line
    text: `The file "${filename}" was successfully uploaded to S3.`, // Email body with the file name
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
