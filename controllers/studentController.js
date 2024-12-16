// controllers/studentController.js
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

// View available time slots
const viewAvailability = async (req, res) => {
  try {
    const { professorId } = req.query; // Assuming professorId is passed as query parameter
    const availability = await Availability.find({ professor: professorId });
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availability.", error });
  }
};

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { studentId, professorId, time } = req.body;
    const existingAppointment = await Appointment.findOne({
      professor: professorId,
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked." });
    }

    const newAppointment = new Appointment({
      student: studentId,
      professor: professorId,
      time,
      status: "booked",
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment.", error });
  }
};

// controllers/studentController.js
const getAppointments = async (req, res) => {
  try {
    const { studentId } = req.query;
    const appointments = await Appointment.find({ student: studentId, status: "booked" });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments.", error });
  }
};

module.exports = { viewAvailability, bookAppointment, getAppointments };
