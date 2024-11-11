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

const updateCustomer = async (req, res) => {
  const id = parseInt(req.params.id); // Customer ID from URL parameters
  const updateData = req.body; // Customer data to be updated

  try {
    const result = await Customer.updateCustomer(id, updateData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Error updating customer" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({ message: "Error retrieving customers" });
  }
};

module.exports = {
  getCustomerByEmail,
  getCustomerByID,
  postCustomer,
  updateCustomer,
  getAllCustomers,
};
