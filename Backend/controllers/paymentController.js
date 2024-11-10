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

const postPayment = async (req, res) => {
  const id = req.params.id;
  const paymentDetails = req.body;
  try {
    const newPayment = await Payment.postPayment(id, paymentDetails);
    res.status(201).json(newPayment);
    console.log("Successfully posted Payment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting payment");
  }
};

const approvePayment = async (req, res) => {
  const orderID = req.params.orderID;
  const adminID = req.body;
  try {
    const updatedPayment = await Payment.approvePayment(orderID, adminID);
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
