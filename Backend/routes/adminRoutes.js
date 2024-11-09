// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/:username", adminController.getAdminByUsername);

module.exports = router;
