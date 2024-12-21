/**
 * @fileoverview Professor Controller
 * Handles all professor-related business logic for availability and appointments
 *
 * @requires ../models/Availability
 * @requires ../models/Appointment
 */

const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

/**
 * Adds new availability slots for a professor
 *
 * @async
 * @function addAvailability
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user details
 * @param {string} req.user.id - Professor's ID
 * @param {Object} req.body - Availability details
 * @param {string} req.body.startTime - Start time of slot
 * @param {string} req.body.endTime - End time of slot
 * @param {string} req.body.date - Date of availability
 * @param {string} req.body.day - Day of the week
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON response confirming addition
 */
const addAvailability = async (req, res) => {
  try {
    const professor = req.user.id;
    const { startTime, endTime, date, day } = req.body;

    // Check for existing availability
    const existingAvailability = await Availability.findOne({
      professor,
      startTime,
      endTime,
      date,
    });

    if (existingAvailability) {
      return res.status(400).json({ message: "Availability already exists." });
    }

    // Create new availability
    const newAvailability = new Availability({
      professor,
      startTime,
      endTime,
      date,
      day,
    });
    await newAvailability.save();
    res.status(201).json({ message: "Availability added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error adding availability.", error });
  }
};

/**
 * Retrieves availability slots for a specific professor
 *
 * @async
 * @function getAvailability
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.professorId - Professor's ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON response with availability data
 */
const getAvailability = async (req, res) => {
  try {
    const professorId = req.params.professorId;
    const availability = await Availability.find({ professor: professorId });

    if (!availability) {
      return res.status(404).json({
        message: "No availability found for this professor.",
      });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availability.", error });
  }
};

/**
 * Cancels an existing appointment
 *
 * @async
 * @function cancelAppointment
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.appointmentId - ID of appointment to cancel
 * @param {Object} req.user - Authenticated user details
 * @param {string} req.user.id - Professor's ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON response confirming cancellation
 */
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const professorId = req.user.id;

    // Find and validate appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Verify professor's authorization
    if (appointment.professor.toString() !== professorId) {
      return res.status(403).json({
        message: "Not authorized to cancel this appointment.",
      });
    }

    // Update appointment status
    appointment.status = "canceled";
    await appointment.save();

    res.status(200).json({ message: "Appointment canceled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error canceling appointment.", error });
  }
};

module.exports = { addAvailability, getAvailability, cancelAppointment };
