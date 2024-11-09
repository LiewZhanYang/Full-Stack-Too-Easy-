const Customer = require("../models/customer");

const getCustomerByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const customer = await Customer.getCustomerByEmail(email);
    if (customer.length === 0) {
      return res.status(404).send("Customer not found");
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Customer");
  }
};

const getCustomerByID = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const customer = await Customer.getCustomerByID(id);
    if (customer.length === 0) {
      return res.status(404).send("Customer not found");
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Customer");
  }
};

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

module.exports = { getCustomerByEmail, getCustomerByID, postCustomer };
