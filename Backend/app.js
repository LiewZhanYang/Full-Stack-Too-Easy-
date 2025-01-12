const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = 8000;
const sql = require("mysql2/promise");

const dotenv = require("dotenv");
dotenv.config();

const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const childRoutes = require("./routes/childRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const programRoutes = require("./routes/programRoutes");
const programtypeRoutes = require("./routes/programtypeRoutes");
const webinarRoutes = require("./routes/webinarRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const signupRoutes = require("./routes/signUpRoutes");
const authController = require("./controllers/authController");
const uploadRoutes = require("./routes/uploadRoutes");
const emailRoutes = require("./routes/emailRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const announceRoutes = require("./routes/announcementRoutes")
const reviewRoutes = require("./routes/reviewRoutes")

app.use("/customer", customerRoutes);
app.use("/admin", adminRoutes);
app.use("/children", childRoutes);
app.use("/booking", bookingRoutes);
app.use("/payment", paymentRoutes);
app.use("/program", programRoutes);
app.use("/type", programtypeRoutes);
app.use("/webinar", webinarRoutes);
app.use("/session", sessionRoutes);
app.use("/signup", signupRoutes);
app.post("/login", authController.login);
app.use("/upload", uploadRoutes);
app.use("/email", emailRoutes);
app.use("/meeting", meetingRoutes);
app.use("/announcement", announceRoutes);
app.use("/review", reviewRoutes);

//const testController = require('./controllers/testController');

// Test Routes (Not Final Routes)
/*app.get("/customer/email/:email", testController.getCustomerByEmail)
app.get("/customer/id/:id", testController.getCustomerByID)
app.post("/customer", testController.postCustomer)
app.get("/admin/:username", testController.getAdminByUsername)
app.get("/children/:id", testController.getChildByAccountID)
app.post("/child", testController.postChild)
app.delete("/child/:id", testController.deleteChild)
app.put("/child/:id", testController.updateChild)
app.post("/booking", testController.postBooking)
app.get("/booking/:id", testController.getBookingByAccountID)
app.delete("/booking/:id", testController.deleteBookingByBookingID)
app.get("/payment", testController.getAllPayment)
app.post("/payment/:id", testController.postPayment)
app.put("/approvepayment/:orderID", testController.approvePayment)
app.put("/rejectpayment/:orderID", testController.rejectPayment)
app.get("/program", testController.getAllPrograms)
app.post("/program", testController.postProgram)
app.get("/session/:id", testController.getSessionsByProgramID)
app.post("/session", testController.postSession)
app.get('/signup', testController.getAllSignUps);
app.get('/signup/:id', testController.getSignUpById);
app.post('/createsignup/:id', testController.createSignUp);
app.put('/updatesignup/:id', testController.updateSignUp);
app.delete('/deletesignup/:id',testController.deleteSignUp);*/

const dbConfig = require("./dbConfig");
/*

app.listen(port, async () => {
  try {
    const connection = await sql.createConnection(dbConfig);
    console.log("Database connection established successfully");
    console.log(`Server listening on port ${port}`);

    process.on("SIGINT", async () => {
      console.log("Server is gracefully shutting down");
      // Perform cleanup tasks (e.g., close database connections)
      await connection.end();
      console.log("Database connection closed");
      process.exit(0); // Exit with code 0 indicating successful shutdown
    });
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }
});
*/

// Stripe Implementation 

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51QRx0kG1MaTqtP83Z47pxbPyInBiDQ9bBfhbePUsWSYXq4q3C2ouNE9jv3r90GAzPDYOAKoHUkvPvKcCwLkAmIpL00zMovbfi2');

app.use(express.static("public"));
app.use(express.json());

const calculateTax = async (items, currency) => {
  const taxCalculation = await stripe.tax.calculations.create({
    currency,
    customer_details: {
      address: {
        line1: "920 5th Ave",
        city: "Seattle",
        state: "WA",
        postal_code: "98104",
        country: "US",
      },
      address_source: "shipping",
    },
    line_items: items.map((item) => buildLineItem(item)),
  });

  return taxCalculation;
};

const buildLineItem = (item) => {
  return {
    amount: item.amount, // Amount in cents
    reference: item.id, // Unique reference for the item in the scope of the calculation
  };
};

// Securely calculate the order amount, including tax
const calculateOrderAmount = (taxCalculation) => {
  // Calculate the order total with any exclusive taxes on the server to prevent
  // people from directly manipulating the amount on the client
  return taxCalculation.amount_total;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a Tax Calculation for the items being sold
  const taxCalculation = await calculateTax(items, 'sgd');
  const amount = await calculateOrderAmount(taxCalculation);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "sgd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      tax_calculation: taxCalculation.id
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// // Invoke this method in your webhook handler when `payment_intent.succeeded` webhook is received
// const handlePaymentIntentSucceeded = async (paymentIntent) => {
//   // Create a Tax Transaction for the successful payment
//   stripe.tax.transactions.createFromCalculation({
//     calculation: paymentIntent.metadata['tax_calculation'],
//     reference: 'myOrder_123', // Replace with a unique reference from your checkout/order system
//   });
// };

app.listen(port, async () => {
  let connection;
  try {
    connection = await sql.createConnection(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    console.log("Continuing without database connection...");
  }

  console.log(`Server listening on port ${port}`);

  process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
    process.exit(0); // Exit with code 0 indicating successful shutdown
  });
});
// Past Code

// const customerRoutes = require("./routes/customerRoutes");
// const programRoutes = require("./routes/programRoutes");
// const sessionRoutes = require('./routes/sessionRoutes');
// const signUpRoutes = require('./routes/signUpRoutes');

// app.use("/api", customerRoutes);
// app.use('/api', programRoutes);
// app.use('/api', sessionRoutes);
// app.use('/api', signUpRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend is up and running!");
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
