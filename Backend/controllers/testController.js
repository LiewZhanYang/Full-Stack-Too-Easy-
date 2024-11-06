const Customer = require("../models/customer");
const Admin = require("../models/admin");
const Child = require("../models/child");
const Booking = require("../models/booking")

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
  deleteBookingByBookingID
} 