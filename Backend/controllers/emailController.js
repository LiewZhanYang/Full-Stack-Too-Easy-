// controllers/emailController.js
const { sendEmail } = require("../models/email");

/**
 * Controller to handle sending email notifications.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} filename - The name of the uploaded file.
 */

exports.sendEmailNotification = async (recipientEmail, paymentDetails) => {
  // Validate inputs
  if (!recipientEmail) {
    throw new Error("Recipient email is required.");
  }

  // Destructure and extract relevant details from paymentDetails
  const {
    OrderID,
    ProgramName,
    Amount,
    CustomerName,
    CustomerPhone,
    CreatedAt,
  } = paymentDetails;

  try {
    // Prepare email content
    const subject = "Payment Receipt - Thank you for your payment!";
    const textContent = `
      Dear ${CustomerName || "Customer"},
      
      Thank you for your payment. Here are the details of your transaction:

      Order ID: ${OrderID || "N/A"}
      Program Name: ${ProgramName || "N/A"}
      Amount Paid: ${Amount ? `$${Amount}` : "N/A"}
      Payment Date: ${CreatedAt || "N/A"}
      Phone Number: ${CustomerPhone || "N/A"}
      
      If you have any questions or concerns regarding your payment, please feel free to contact us.
      
      Thank you for choosing our services!

      Best regards,
      [Your Company Name]
    `;

    // Send the email using the sendEmail function from the model
    const emailResponse = await sendEmail(recipientEmail, subject, textContent);

    console.log("Email sent successfully:", emailResponse);
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Pass the error back to the caller for handling
  }
};
