const Customer = require("../models/customer");

exports.addCustomer = async (req, res) => {
  try {
    const result = await Customer.addCustomer(req.body);
    res.status(201).json({ message: "Customer added successfully", result });
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const [customer] = await Customer.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    await Customer.updateCustomer(req.params.id, req.body);
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteCustomer(req.params.id);
    res
      .status(200)
      .json({ message: "Customer and related bookings deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
