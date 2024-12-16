// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Get available time slots
router.get("/availability", studentController.viewAvailability);

// Book an appointment
router.post("/book", studentController.bookAppointment);

// routes/studentRoutes.js
router.get("/appointments", studentController.getAppointments);

module.exports = router;
