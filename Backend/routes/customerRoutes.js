// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const multer = require("multer");

// Configure Multer for handling profile picture uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to get customer by email
router.get("/email/:email", customerController.getCustomerByEmail);

// Route to get a customer by ID
router.get("/id/:id", customerController.getCustomerByID);

// Route to create a new customer
router.post("/", customerController.postCustomer);

// Route to update a customer by ID (with optional profile picture upload)
router.put("/id/:id", upload.single("file"), customerController.updateCustomer);

// Route to get all customers
router.get("/", customerController.getAllCustomers);

// Route to update customer membership status
router.put("/member/:id", customerController.updateCustomerMembership);

module.exports = router;
