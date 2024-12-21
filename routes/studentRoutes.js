/**
 * @fileoverview Student Routes Configuration
 * Defines all routes related to student appointment management functionality
 *
 * @requires express
 * @requires ../controllers/studentController
 * @requires ../middlewares/authMiddleware
 * @requires ../middlewares/roles
 * @requires ../models/Appointment
 * @module routes/studentRoutes
 */

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const roleMiddleware = require("../middlewares/roles");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/Appointment");

/**
 * View Available Time Slots Route
 * Retrieves all available appointment slots that students can book
 *
 * @route GET /api/student/availability
 * @access Public
 */
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
 * @returns {Array} appointments - List of student's appointments
 * @throws {404} If no appointments are found
 * @throws {500} If server error occurs during fetch
 * @access Private (Students only)
 */
router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware("student"),
  async (req, res) => {
    try {
      const studentId = req.user.id;
      const appointments = await Appointment.find({ student: studentId });

      if (!appointments.length) {
        return res.status(404).json({ message: "No appointments found." });
      }

      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments.", error });
    }
  }
);

/**
 * Export the router instance with all student routes
 * @exports router
 */
module.exports = router;
