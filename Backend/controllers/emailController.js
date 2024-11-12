// controllers/emailController.js
const { sendEmail } = require("../models/email");

/**
 * Controller to handle sending email notifications.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} filename - The name of the uploaded file.
 */
exports.sendEmailNotification = async (recipientEmail, filename) => {
  // Validate inputs
  if (!recipientEmail || !filename) {
    throw new Error("Recipient email and filename are required.");
  }

  try {
    const subject = "New File Uploaded to S3";
    const textContent = `The file "${filename}" was successfully uploaded to S3.`;

    // Call the model function to send the email
    const emailResponse = await sendEmail(recipientEmail, subject, textContent);

    console.log("Email sent successfully:", emailResponse);
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Pass the error back to the caller for handling
  }
};
