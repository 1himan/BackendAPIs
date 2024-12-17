// controllers/professorController.js
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

// Add availability for a professor
const addAvailability = async (req, res) => {
  try {
    const professor = req.user.id;
    const { startTime, endTime, date, day } = req.body;

    const existingAvailability = await Availability.findOne({
      professor,
      startTime,
      endTime,
    });

    if (existingAvailability) {
      return res.status(400).json({ message: "Availability already exists." });
    }

    const newAvailability = new Availability({
      professor,
      startTime,
      endTime,
      date,
      day,
    });
    console.log(newAvailability)
    await newAvailability.save();
    res.status(201).json({ message: "Availability added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error adding availability.", error });
  }
};

// Get available time slots for a professor
const getAvailability = async (req, res) => {
  console.log("This shit runs")
  try {
    const professorId = req.params.professorId;
    console.log(professorId)
    const availability = await Availability.find({ professor: professorId });
    console.log(availability)
    if (!availability) {
      return res
        .status(404)
        .json({ message: "No availability found for this professor." });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availability.", error });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.status = "canceled";
    await appointment.save();

    res.status(200).json({ message: "Appointment canceled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error canceling appointment.", error });
  }
};

module.exports = { addAvailability, getAvailability, cancelAppointment };
