// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", paymentController.getAllPayment);
router.post("/", upload.single("file"), paymentController.postPayment);
router.put("/approvepayment/:orderID", paymentController.approvePayment);
router.put("/rejectpayment/:orderID", paymentController.rejectPayment);
router.get("/:orderID", paymentController.getPaymentById);

module.exports = router;
