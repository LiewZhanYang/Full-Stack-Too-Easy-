// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/email/:email", customerController.getCustomerByEmail);
router.get("/id/:id", customerController.getCustomerByID);
router.post("/", customerController.postCustomer);
router.put("/id/:id", customerController.updateCustomer);
router.get("/", customerController.getAllCustomers);

module.exports = router;
