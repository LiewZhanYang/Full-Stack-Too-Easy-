const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Route to add a customer
router.post("/customers", customerController.addCustomer);

// Route to get a customer by ID
router.get("/customers/:id", customerController.getCustomerById);

// Route to update a customer by ID
router.put("/customers/:id", customerController.updateCustomer);

// Route to delete a customer by ID
router.delete("/customers/:id", customerController.deleteCustomer);

module.exports = router;
