/**
 * @fileoverview Main server configuration file for the College Appointment System
 * This file sets up the Express server, database connection, middleware, and routes.
 *
 * @requires express
 * @requires mongoose
 * @requires body-parser
 * @requires cookie-parser
 */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/**
 * Middleware Configuration
 * - bodyParser.json(): Parses incoming JSON payloads
 * - cookieParser(): Parses Cookie header and populates req.cookies
 */
app.use(bodyParser.json());
app.use(cookieParser());

/**
 * Database Connection
 * Establishes connection to MongoDB using Mongoose
 *
 * @param {string} url - MongoDB connection URL
 * @param {Object} options - MongoDB connection options
 * @returns {Promise} Resolves when connection is established
 *
 * Database Name: college-appointment-system
 * Host: localhost
 * Port: Default MongoDB port (27017)
 */
mongoose
  .connect("mongodb://localhost/college-appointment-system", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/**
 * Route Imports
 * Importing modularized route handlers for different functionalities
 *
 * @requires ./routes/authRoutes - Authentication related routes
 * @requires ./routes/professorRoutes - Professor specific routes
 * @requires ./routes/studentRoutes - Student specific routes
 */
const authRoutes = require("./routes/authRoutes");
const professorRoutes = require("./routes/professorRoutes");
const studentRoutes = require("./routes/studentRoutes");

/**
 * Route Middleware Setup
 * Configures the base paths for different route modules
 *
 * Authentication routes: /api/auth/*
 * Professor routes: /api/professor/*
 * Student routes: /api/student/*
 */
app.use("/api/auth", authRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/student", studentRoutes);

/**
 * Server Initialization
 * Starts the Express server on the specified port
 *
 * @param {number} port - Port number (5000)
 * @param {Function} callback - Function to execute once server starts
 */
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

/**
 * Module Exports
 * Exports the configured Express application for testing or external use
 *
 * @exports app
 * @type {Object} Express application instance
 */
module.exports = app;
