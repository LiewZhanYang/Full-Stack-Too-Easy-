const Payment = require("../models/payment");
const uploadController = require("../controllers/uploadController");
const { getFileByOrderID } = require("../controllers/uploadController");
const { sendEmailNotification } = require("../controllers/emailController");
const { scheduleReminderEmail } = require("../controllers/emailController");

const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig");
const getAllPayment = async (req, res) => {
  try {
    const payments = await Payment.getAllPayment();
    if (payments.length === 0) {
      return res.status(404).send("Payments not found");
    }
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving payments");
  }
};
// Format the date to MySQL-compatible format
const formatDateForMySQL = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

const postPayment = async (req, res) => {
  try {
    //console.log("Checking for req body", req.body);

    // Sanitize and prepare InvoiceID
    let invoiceID = req.body.InvoiceID;
    if (invoiceID === undefined || invoiceID === null) {
      invoiceID = "";
    } else if (typeof invoiceID !== "string") {
      invoiceID = String(invoiceID);
    }
    invoiceID = invoiceID.replace(/\D/g, ""); // Retain only numeric characters

    // Prepare payment details
    const paymentDetails = {
      InvoiceID: invoiceID,
      Amount: req.body.Amount,
      CreatedAt: formatDateForMySQL(new Date()),
      Status: req.body.Status || "Pending",
      InvoicePath: req.body.InvoicePath || "default.png",
      SessionID: req.body.SessionID,
      PaidBy: parseInt(req.body.PaidBy, 10),
      ApprovedBy: req.body.ApprovedBy || null,
      Reason: req.body.Reason || null,
    };
    console.log("Validated payment data:", paymentDetails);

    // Create payment record
    const result = await Payment.postPayment(paymentDetails);
    console.log("Validated result data:", result);

    if (!result.OrderID) {
      throw new Error("Order ID was not generated by the database.");
    }

    // Upload the file using uploadController
    const file = req.file;
    //console.log("Received file:", file);
    if (file) {
      try {
        await uploadController.uploadFile(file, `${result.OrderID}`);
        paymentDetails.InvoicePath = `${result.OrderID}/${file.originalname}`;
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        return res.status(500).json({ error: "Error uploading file to S3." });
      }
    }
    const connection = await mysql.createConnection(dbConfig);
    const [userRows] = await connection.execute(
      `SELECT Name
     FROM Customer
    WHERE accountID = ?`,
      [paymentDetails.PaidBy]
    );
    const CustomerName = userRows[0].Name;
    //console.log("CustomerName: ", CustomerName);
    const [SessionRows] = await connection.execute(
      `SELECT DATE_FORMAT(StartDate, '%Y-%m-%d') AS StartDate, TierID
       FROM Session
       WHERE SessionID = ?`,
      [paymentDetails.SessionID]
    );
    console.log("check 1");
    const TierID = SessionRows[0].TierID;
    const SessionDate = SessionRows[0].StartDate;
    console.log("Session Start Date: ", SessionDate);
    console.log("ProgramID: ", TierID);
    console.log("check 2");

    const [TierRows] = await connection.execute(
      `SELECT Name
      FROM Tier
      WHERE TierID = ?`,
      [TierID]
    );
    const ProgramName = TierRows[0].Name;
    console.log("ProgramName: ", ProgramName);
    console.log("check 3");

    const sessionDateObj = new Date(SessionDate);
    const formattedSessionDate = sessionDateObj.toISOString().split("T")[0];
    const createdAtObj = new Date(paymentDetails.CreatedAt);
    const formattedCreatedAt = createdAtObj.toISOString().split("T")[0];
    const emailDetails = {
      OrderID: result.OrderID,
      CustomerName: CustomerName,
      ProgramName: ProgramName,
      Cost: paymentDetails.Amount,
      SessionDate: formattedSessionDate,
      CreatedAt: formattedCreatedAt,
    };

    // Send email notification after successful payment creation and file upload
    try {
      const recipientEmail = process.env.ADMIN_EMAIL; // Replace with your hard-coded recipient email
      console.log(emailDetails);
      await sendEmailNotification(recipientEmail, emailDetails);
      await scheduleReminderEmail(recipientEmail, emailDetails);
      console.log("Email notification sent successfully.");
    } catch (emailError) {
      console.error("Error sending email notification:", emailError.message);
    }

    // Respond with the OrderID and payment details
    res.status(200).json({
      OrderID: result.OrderID,
      ...paymentDetails,
    });
  } catch (error) {
    console.error("Error in postPayment:", error.message);
    res
      .status(500)
      .json({ error: "Error creating payment", details: error.message });
  }
};

const approvePayment = async (req, res) => {
  const orderID = req.params.orderID;
  const approveDetails = req.body;
  try {
    const updatedPayment = await Payment.approvePayment(
      orderID,
      approveDetails
    );
    try {
      const recipientEmail = process.env.ADMIN_EMAIL; // Replace with your hard-coded recipient email
      const emailDetails = `
        Program Name: ${result.OrderID || "N/A"}
        Cost: ${paymentDetails.Amount || "N/A"}
        Name: ${req.body.CustomerName || "N/A"}
        Phone Number: ${req.body.CustomerPhone || "N/A"}
      `;

      await sendEmailNotification(recipientEmail, emailDetails);

      console.log("Email notification sent successfully.");
    } catch (emailError) {
      console.error("Error sending email notification:", emailError.message);
    }
    res.status(201).json(updatedPayment);
    console.log("Successfully approved Payment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error approving payment");
  }
};

const rejectPayment = async (req, res) => {
  const orderID = req.params.orderID;
  const rejectDetails = req.body;
  try {
    const rejectedPayment = await Payment.rejectPayment(orderID, rejectDetails);
    res.status(201).json(rejectedPayment);
    console.log("Successfully rejected Payment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rejecting payment");
  }
};

const getPaymentById = async (req, res) => {
  const orderID = req.params.orderID;

  try {
    // Fetch payment details from the database
    const payment = await Payment.getPaymentById(orderID);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Fetch the screenshot URL using the `getFileByOrderID` function
    try {
      const { url } = await getFileByOrderID(orderID);
      console.log("Generated screenshot URL:", url); // Logging the URL for debugging
      res.json({ ...payment, screenshotUrl: url });
    } catch (fileError) {
      console.error("Error retrieving file URL:", fileError);
      // Return payment details but indicate file retrieval error
      res.status(200).json({
        ...payment,
        screenshotUrl: null,
        fileError: "Error retrieving file from S3.",
      });
    }
  } catch (error) {
    console.error("Error retrieving payment by ID:", error);
    res.status(500).json({ message: "Error retrieving payment" });
  }
};
module.exports = {
  getAllPayment,
  postPayment,
  approvePayment,
  rejectPayment,
  getPaymentById,
};
