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

// Book an appointmentconst 
const bookAppointment = async (req, res) => {
  try {
    const { studentId, professorId, startTime, endTime, date, day } = req.body;

    // Debugging input
    // console.log("Book Appointment Input:", req.body);

    if (!studentId || !professorId || !startTime || !date) {
      return res
        .status(400)
        .json({ message: "Invalid request data.", body: req.body });
    }

    const existingAppointment = await Appointment.findOne({
      professor: professorId,
      date: date,
      startTime: startTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Time slot already booked.",
        query: { professor: professorId, date, startTime },
      });
    }

    const newAppointment = new Appointment({
      student: studentId,
      professor: professorId,
      startTime,
      endTime,
      date,
      day,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      message: "Error booking appointment.",
      error: error.message,
      stack: error.stack, // Log the error stack trace for debugging
      body: req.body, // Include the request body for debugging
    });
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
