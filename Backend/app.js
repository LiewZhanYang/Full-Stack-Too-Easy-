const express = require("express");
const app = express();
app.use(express.json());

const port = 8000
const sql = require('mysql2/promise');

const dotenv = require('dotenv');
dotenv.config();

const testController = require('./controllers/testController');

// Test Routes (Not Final Routes)
app.get("/customer/email/:email", testController.getCustomerByEmail)
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

const dbConfig = require('./dbConfig')

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