/**
 * @fileoverview Student Controller
 * Handles all student-related business logic for appointments and availability
 *
 * @requires ../models/Availability
 * @requires ../models/Appointment
 * @requires ../models/User
 */

const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

/**
 * Retrieves available time slots for a specific professor
 *
 * @async
 * @function viewAvailability
 * @param {Object} req - Express request object
 * @param {string} req.query.professorId - ID of the professor
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON response with availability data
 */
const viewAvailability = async (req, res) => {
  try {
    const { professorId } = req.query;

    if (!professorId) {
      return res.status(400).json({ message: "Professor ID is required." });
    }

    const professor = await User.findOne({ _id: professorId, role: "professor" });

    if (!professor) {
      return res.status(404).json({ message: "Professor not found." });
    }

    const availability = await Availability.find({ professor: professorId });
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availability.", error });
  }
};

/**
 * Books a new appointment with a professor
 *
 * @async
 * @function bookAppointment
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing appointment details
 * @param {string} req.body.studentId - ID of the student
 * @param {string} req.body.professorId - ID of the professor
 * @param {string} req.body.startTime - Start time of appointment
 * @param {string} req.body.endTime - End time of appointment
 * @param {string} req.body.date - Date of appointment
 * @param {string} req.body.day - Day of the week
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON response with booking confirmation
 */
const bookAppointment = async (req, res) => {
  try {
    const { studentId, professorId, startTime, endTime, date, day } = req.body;

    if (!studentId || !professorId || !startTime || !endTime || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (new Date(date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot book appointments in the past." });
    }

    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time." });
    }

    const [student, professor] = await Promise.all([
      User.findOne({ _id: studentId, role: "student" }),
      User.findOne({ _id: professorId, role: "professor" }),
    ]);

    if (!student || !professor) {
      return res.status(404).json({
        message: !student ? "Student not found" : "Professor not found",
      });
    }

    const overlapping = await Appointment.findOne({
      professor: professorId,
      date,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (overlapping) {
      return res.status(400).json({
        message: "This time slot overlaps with an existing appointment.",
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
    res.status(500).json({ message: "Error booking appointment.", error });
  }
};

/**
 * Retrieves all booked appointments for a student
 *
 * @async
 * @function getAppointments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON response with appointments
 */

const getAppointments = async (req, res) => {
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
};

module.exports = { viewAvailability, bookAppointment, getAppointments };
