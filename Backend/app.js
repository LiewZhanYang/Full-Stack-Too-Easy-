const express = require("express");
const multer = require("multer");
const db = require("./dbConfig");
const customerRoutes = require("./routes/customerRoutes");
const programRoutes = require("./routes/programRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const signUpRoutes = require("./routes/signUpRoutes");
const fileController = require("./controllers/uploadController");
const uploadMiddleware = require("./middleware/uploadMiddleware");

const app = express();
require("dotenv").config();
app.use(express.json());

app.use("/api", customerRoutes);
app.use("/api", programRoutes);
app.use("/api", sessionRoutes);
app.use("/api", signUpRoutes);

app.post("/api/upload", uploadMiddleware, fileController.uploadFile);

app.get("/", (req, res) => {
  res.send("Backend is up and running!");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
