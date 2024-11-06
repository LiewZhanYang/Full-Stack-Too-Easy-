const Customer = require("../models/customer");
const Admin = require("../models/admin");
const Child = require("../models/child");
const Booking = require("../models/booking")
const Payment = require("../models/payment")
const Program = require("../models/program")
const Session = require("../models/session")

const getCustomerByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    //fetch Customer with given id
    const customer = await Customer.getCustomerByEmail(email);
    if (customer.length === 0) {
      //send 404 if Customer not found
      return res.status(404).send("Customer not found");
    }
    //send customer data as json
    res.json(customer);
  } catch (error) {
    //log the error if there is
    console.error(error);
    res.status(500).send("Error retrieving Customer");
  }
}

const getCustomerByID = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    //fetch Customer with given id
    const customer = await Customer.getCustomerByID(id);
    if (customer.length === 0) {
      //send 404 if Customer not found
      return res.status(404).send("Customer not found");
    }
    //send customer data as json
    res.json(customer);
  } catch (error) {
    //log the error if there is
    console.error(error);
    res.status(500).send("Error retrieving Customer");
  }
}

const postCustomer = async (req, res) => {
  const customerDetails = req.body;
  try {
    const newCustomer = await Customer.postCustomer(customerDetails);
    res.status(201).json(newCustomer);
    console.log("Successfully posted Customer");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Customer");
  }
};

const getAdminByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const admin = await Admin.getAdminByUsername(username);
    if (admin.length === 0) {
      return res.status(404).send("admin not found");
    }
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving admin");
  }
}

const getChildByAccountID = async (req, res) => {
  const AccountID = req.params.id;
  try {
    const children = await Child.getChildByAccountID(AccountID);
    if (children.length === 0) {
      return res.status(404).send("children not found");
    }
    res.json(children);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving children");
  }
}

const postChild = async (req, res) => {
  const childDetails = req.body;
  try {
    const newChild = await Child.postChild(childDetails);
    res.status(201).json(newChild);
    console.log("Successfully posted Child");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Child");
  }
}

const deleteChild = async (req, res) => {
  const childID = req.params.id;
  try {
    const deletedChild = await Child.deleteChild(childID);
    res.status(201).json(deletedChild);
    console.log("Successfully deleted Child");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting Child");
  }
}

const updateChild = async (req, res) => {
  const id = req.params.id;
  const childDetails = req.body;
  try {
    const updatedChild = await Child.updateChild(id, childDetails);
    res.status(201).json(updatedChild);
    console.log("Successfully updating Child");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating Child");
  }
}

const postBooking = async (req, res) => {
  const bookingDetails = req.body;
  try {
    const newBooking = await Booking.postBooking(bookingDetails);
    res.status(201).json(newBooking);
    console.log("Successfully posted Booking");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Booking");
  }
}

const getBookingByAccountID = async (req, res) => {
  const AccountID = req.params.id;
  try {
    const bookings = await Booking.getBookingByAccountID(AccountID);
    if (bookings.length === 0) {
      return res.status(404).send("bookings not found");
    }
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving bookings");
  }
}

const deleteBookingByBookingID = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBooking = await Booking.deleteBookingByBookingID(id);
    res.status(201).json(deletedBooking);
    console.log("Successfully deleted Booking");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting Booking");
  }
}

const getAllPayment = async (req, res) => {
  try {
    const payments = await Payment.getAllPayment();
    if (payments.length === 0) {
      return res.status(404).send("Payment not found");
    }
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Payment");
  }
}

const postPayment = async (req, res) => {
  const id = req.params.id;
  const paymentDetails = req.body;
  try {
    const newPayment = await Payment.postPayment(id, paymentDetails);
    res.status(201).json(newPayment);
    console.log("Successfully posted Payment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Payment");
  }
}

const approvePayment = async (req, res) => {
  const orderID = req.params.orderID;
  const adminID = req.body;
  try {
    const updatedPayment = await Payment.approvePayment(orderID, adminID);
    res.status(201).json(updatedPayment);
    console.log("Successfully approved Payment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error approved Payment");
  }
}

const rejectPayment = async (req, res) => {
  const orderID = req.params.orderID;
  const rejectDetails = req.body;
  try {
    const rejectedPayment = await Payment.rejectPayment(orderID, rejectDetails);
    res.status(201).json(rejectedPayment);
    console.log("Successfully rejected Payment");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rejecting Payment");
  }
}

const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.getAllPrograms();
    if (programs.length === 0) {
      return res.status(404).send("Program not found");
    }
    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Program");
  }
}

const postProgram = async (req, res) => {
  const programDetails = req.body;
  try {
    const newProgram = await Program.postProgram(programDetails);
    res.status(201).json(newProgram);
    console.log("Successfully posted Program");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Program");
  }
}

const getSessionsByProgramID = async (req, res) => {
  const programID = req.params.id
  try {
    const sessions = await Session.getSessionsByProgramID(programID);
    if (sessions.length === 0) {
      return res.status(404).send("Sessions not found");
    }
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Sessions");
  }
}

const postSession = async (req, res) => {
  const sessionDetails = req.body;
  try {
    const newSession = await Session.postSession(sessionDetails);
    res.status(201).json(newSession);
    console.log("Successfully posted Session");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Session");
  }
}

module.exports = {
  getCustomerByEmail,
  getCustomerByID,
  postCustomer,
  getAdminByUsername,
  getChildByAccountID,
  postChild,
  deleteChild,
  updateChild,
  postBooking,
  getBookingByAccountID,
  deleteBookingByBookingID,
  getAllPayment,
  postPayment,
  approvePayment,
  rejectPayment,
  getAllPrograms,
  postProgram,
  getSessionsByProgramID,
  postSession
} 