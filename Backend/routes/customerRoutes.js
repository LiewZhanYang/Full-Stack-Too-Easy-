// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/email/:email", customerController.getCustomerByEmail);
router.get("/id/:id", customerController.getCustomerByID);
router.post("/", customerController.postCustomer);

module.exports = router;
