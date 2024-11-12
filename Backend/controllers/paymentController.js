const Payment = require("../models/payment");

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
  return date.toISOString().slice(0, 19).replace('T', ' ');
};



const postPayment = async (req, res) => {
  try {
    // Ensure InvoiceID is a string, or set it to an empty string if undefined or null
    let invoiceID = req.body.InvoiceID;
    if (invoiceID === undefined || invoiceID === null) {
      invoiceID = '';
    } else if (typeof invoiceID !== 'string') {
      invoiceID = String(invoiceID); // Convert to string if it's a number
    }
    // Remove non-numeric characters from InvoiceID
    invoiceID = invoiceID.replace(/\D/g, '');

    // Prepare other payment details
    const paymentDetails = {
      InvoiceID: invoiceID,
      Amount: req.body.Amount,
      CreatedAt: formatDateForMySQL(new Date()),
      Status: req.body.Status || 'Pending',
      InvoicePath: req.body.InvoicePath || 'default.png',
      SessionID: req.body.SessionID,
      PaidBy: parseInt(req.body.PaidBy, 10), // Convert PaidBy to an integer
      ApprovedBy: req.body.ApprovedBy,
      Reason: req.body.Reason,
    };

    console.log("Validated payment data:", paymentDetails);

    // Call the model to create payment
    const result = await Payment.postPayment(paymentDetails);

    // Check if OrderID was returned
    if (!result.OrderID) {
      throw new Error("Order ID was not generated by the database.");
    }

    // Respond with the OrderID and payment details
    res.status(200).json({
      OrderID: result.OrderID,
      ...paymentDetails,
    });
  } catch (error) {
    console.error("Error in postPayment:", error.message);
    res.status(500).json({ error: "Error creating payment", details: error.message });
  }
};



const approvePayment = async (req, res) => {
  const orderID = req.params.orderID;
  const approveDetails = req.body;
  try {
    const updatedPayment = await Payment.approvePayment(orderID, approveDetails);
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
    const payment = await Payment.getPaymentById(orderID);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
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
