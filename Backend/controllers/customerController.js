const Customer = require("../models/customer");

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

module.exports = {
  getCustomerByEmail
}