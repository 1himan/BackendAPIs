// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const roleMiddleware = require("../middlewares/roles");
const authMiddleware = require("../middlewares/authMiddleware");

// Get available time slots
router.get("/availability", studentController.viewAvailability);

// Book an appointment
router.post("/book", studentController.bookAppointment);

// routes/studentRoutes.js
router.get(
  "/appointments",
  authMiddleware, // Validates the token
  roleMiddleware("student"), // Ensures only students can access
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

module.exports = router;
