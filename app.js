// main server file app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


// Middleware
app.use(bodyParser.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const professorRoutes = require("./routes/professorRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/student", studentRoutes);
app.use(cookieParser());

// Connect to the database
mongoose
  .connect("mongodb://localhost/college-appointment-system", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start the server
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
// when sending req via supertest you said to close the main server port and export your app
// and make a separate server.js file and run the port
module.exports = app; 