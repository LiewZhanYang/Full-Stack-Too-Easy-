// controllers/emailController.js
const { sendEmail } = require("../models/email");
const schedule = require("node-schedule");

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
  console.log("Email Details: ", paymentDetails);
  try {
    // Prepare email content
    const subject = "Payment Receipt - Thank you for your payment!";
    const textContent = `
      Dear ${paymentDetails.CustomerName || "Customer"},
      
      Thank you for your payment. Here are the details of your transaction:

      Order ID: ${paymentDetails.OrderID || "N/A"}
      Program Name: ${paymentDetails.ProgramName || "N/A"}
      Amount Paid: ${paymentDetails.Cost ? `$${paymentDetails.Cost}` : "N/A"}
      Payment Date: ${paymentDetails.CreatedAt || "N/A"}
      Session Date: ${paymentDetails.SessionDate || "N/A"}
      
      If you have any questions or concerns regarding your payment, please feel free to contact us.
      
      Thank you for choosing our services!

      Best regards,
      Mindsphere
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

exports.scheduleReminderEmail = async (recipientEmail, emailDetails) => {
  const { CustomerName, SessionDate, Cost } = emailDetails;
  console.log("Current System Time:", new Date());

  const sessionDateObj = new Date(SessionDate);
  sessionDateObj.setDate(sessionDateObj.getDate() - 4);
  console.log("This is the date", sessionDateObj);
  schedule.scheduleJob(sessionDateObj, async () => {
    try {
      console.log("Current System Time:", new Date());

      const subject = "Event Reminder";
      const textContent = `
        Dear ${CustomerName || "Customer"},

        This is a reminder that your session is happening on ${
          emailDetails.SessionDate
        }. The cost you have paid is $${Cost || "N/A"}.

        Regards,
        Mindsphere
      `;

      const emailResponse = await sendEmail(
        recipientEmail,
        subject,
        textContent
      );
      console.log("Email sent successfully:", emailResponse);
      return emailResponse;
    } catch (error) {
      console.error("Error sending scheduled email:", error);
    }
  });
};
