// routes/professorRoutes.js
const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roles");

// Add availability
router.post(
  "/availability",
  authMiddleware, // Validates the token and sets req.user
  roleMiddleware("professor"), // Ensures only professors can access
  professorController.addAvailability
);

// Get professor's availability
router.get("/availability/:professorId", professorController.getAvailability);

// routes/professorRoutes.js
router.put(
  "/cancel-appointment/:appointmentId",
  professorController.cancelAppointment
);

module.exports = router;
