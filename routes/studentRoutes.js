/**
 * @fileoverview Student Routes Configuration
 * Defines all routes related to student appointment management functionality
 *
 * @requires express
 * @requires ../controllers/studentController
 * @requires ../middlewares/authMiddleware
 * @requires ../middlewares/roles
 */

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roles");

/**
 * View Available Time Slots Route
 * Retrieves all available appointment slots that students can book
 *
 * @route GET /api/student/availability
 * @access Public
 */

// /api/students/availability - get request
router.get("/availability", studentController.viewAvailability);

/**
 * Book Appointment Route
 * Allows students to schedule appointments in available time slots
 *
 * @route POST /api/student/book
 * @access Public
 */
router.post("/book", studentController.bookAppointment);

/**
 * Get Student's Appointments Route
 * Retrieves all appointments for the authenticated student
 *
 * @route GET /api/student/appointments
 * @middleware authMiddleware - Validates JWT token and sets req.user
 * @middleware roleMiddleware("student") - Ensures user is a student
 * @access Private (Students only)
 */
router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware("student"),
  studentController.getAppointments
);

/**
 * Export the router instance with all student routes
 * @exports router
 */
module.exports = router;
