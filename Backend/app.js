const express = require("express");
const db = require("./dbConfig");
const customerRoutes = require("./routes/customerRoutes");
const programRoutes = require("./routes/programRoutes");
const app = express();

app.use(express.json());

app.use("/api", customerRoutes);
app.use('/api', programRoutes);


app.get("/", (req, res) => {
  res.send("Backend is up and running!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
