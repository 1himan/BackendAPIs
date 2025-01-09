/**
 * @fileoverview Main server configuration file for the College Appointment System
 * This file sets up the Express server, database connection, middleware, and routes.
 *
 * @requires express
 * @requires mongoose
 * @requires body-parser
 * @requires cookie-parser
 * @requires dotenv
 */

// Load environment variables based on NODE_ENV
require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});
// Add this right after the dotenv.config() call
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('CA_CERT_PATH:', process.env.CA_CERT_PATH); 

// Check if MONGO_URI is defined and starts with the correct scheme
if (!process.env.MONGO_URI || (!process.env.MONGO_URI.startsWith('mongodb://') && !process.env.MONGO_URI.startsWith('mongodb+srv://'))) {
  console.error('Invalid MONGO_URI. It must start with "mongodb://" or "mongodb+srv://".');
  process.exit(1);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Ensure all middleware functions are correctly imported
// const someMiddleware = require('./middlewares/someMiddleware'); // Example middleware

/**
 * Middleware Configuration
 * - bodyParser.json(): Parses incoming JSON payloads
 * - cookieParser(): Parses Cookie header and populates req.cookies
 */
app.use(bodyParser.json());
app.use(cookieParser());

// Ensure the middleware function is defined and used correctly
// app.use(someMiddleware);

/**
 * Database Connection
 * Establishes connection to MongoDB/DocumentDB using Mongoose
 *
 * @param {string} url - MongoDB/DocumentDB connection URL from environment variables
 * @param {Object} options - Connection options including TLS settings
 * @returns {Promise} Resolves when connection is established
 */
const connectionOptions = {};

// Include CA Certificate if provided in environment
if (process.env.CA_CERT_PATH) {
  connectionOptions.tlsCAFile = process.env.CA_CERT_PATH;
}

mongoose
  .connect(process.env.MONGO_URI, connectionOptions)
  .then(() => console.log("Connected to MongoDB/DocumentDB"))
  .catch((err) => console.error("Database connection error:", err));

/**
 * Route Imports
 * Importing modularized route handlers for different functionalities
 */
const authRoutes = require("./routes/authRoutes");
const professorRoutes = require("./routes/professorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { bookAppointment } = require("./controllers/wardenController");

/**
 * Route Middleware Setup
 * Configures the base paths for different route modules
 */
app.get("/", (req, res) => {
  res.send("Hello and welcome to our server!");
});
app.use("/api/auth", authRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/warden", bookAppointment);
app.post("/api/warden/book", bookAppointment);
// warden /api/warden/book - post request
// {
//   "wardenId": "6779095bcd14fb33fdd781df", // Replace with a valid ObjectId from your User collection
//   "startTime": "12:00 PM",
//   "endTime": "1:00 PM",
//   "date": "2025-01-06", // Replace with your desired date
//   "day": "Sunday"
// }

/**
 * Server Initialization
 * Starts the Express server on the specified port
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
  console.log(`Server running on port ${PORT} and accessible to all IPs`);
});

module.exports = app;
