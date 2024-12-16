// routes/professorRoutes.js
const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");

// Add professor's availability
router.post("/availability", professorController.addAvailability);

// Get professor's availability
router.get("/availability", professorController.getAvailability);

// routes/professorRoutes.js
router.put("/cancel-appointment/:appointmentId", professorController.cancelAppointment);

module.exports = router;
