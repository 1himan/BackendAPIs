/**
 * @fileoverview Professor Routes Configuration
 * Defines all routes related to professor functionality
 *
 * @requires express
 * @requires ../controllers/professorController
 * @requires ../middlewares/authMiddleware
 * @requires ../middlewares/roles
 * @module routes/professorRoutes
 */

const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roles");

/**
 * Add Availability Route
 * Allows professors to add their available time slots
 *
 * @route POST /api/professor/availability
 * @middleware authMiddleware - Validates JWT token and sets req.user
 * @middleware roleMiddleware("professor") - Ensures user is a professor
 * @access Private (Professors only)
 */
router.post(
  "/availability",
  authMiddleware, // Validates the token and sets req.user
  roleMiddleware("professor"), // Ensures only professors can access
  professorController.addAvailability
);

/**
 * Get Professor's Availability Route
 * Retrieves all available time slots for a specific professor
 *
 * @route GET /api/professor/availability/:professorId
 * @param {string} professorId - The ID of the professor
 * @access Public
 */
router.get("/availability/:professorId", professorController.getAvailability);

/**
 * Cancel Appointment Route
 * Allows professors to cancel their scheduled appointments
 *
 * @route PUT /api/professor/cancel-appointment/:appointmentId
 * @param {string} appointmentId - The ID of the appointment to cancel
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleMiddleware("professor") - Ensures user is a professor
 * @access Private (Professors only)
 */
router.put(
  "/cancel-appointment/:appointmentId",
  authMiddleware, // Validates the token
  roleMiddleware("professor"), // Ensures only professors can access
  professorController.cancelAppointment
);

/**
 * Export the router instance with all professor routes
 * @exports router
 */
module.exports = router;
