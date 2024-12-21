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
  const { studentId, professorId, startTime, endTime, date, day } = req.body;

  /**
   * Validates all required appointment data fields and timing logic
   * @returns {Object} Object containing validation result and any error details
   */
  const validateAppointmentData = () => {
    const requiredFields = [
      "studentId",
      "professorId",
      "startTime",
      "endTime",
      "date",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length) {
      return {
        isValid: false,
        error: {
          status: 400,
          message: "Missing required fields",
          required: missingFields,
        },
      };
    }

    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return {
        isValid: false,
        error: {
          status: 400,
          message: "Cannot book appointments in the past",
        },
      };
    }

    if (startTime >= endTime) {
      return {
        isValid: false,
        error: {
          status: 400,
          message: "Start time must be before end time",
        },
      };
    }

    return { isValid: true };
  };

  /**
   * Validates existence and roles of both student and professor
   * @param {string} studentId - Student's ID to validate
   * @param {string} professorId - Professor's ID to validate
   * @returns {Promise<Object>} Validation result with user details if valid
   */
  const validateUsers = async (studentId, professorId) => {
    try {
      const [student, professor] = await Promise.all([
        User.findOne({ _id: studentId, role: "student" }),
        User.findOne({ _id: professorId, role: "professor" }),
      ]);

      if (!student || !professor) {
        return {
          isValid: false,
          error: {
            status: 404,
            message: !student ? "Student not found" : "Professor not found",
          },
        };
      }

      return { isValid: true, student, professor };
    } catch (error) {
      return {
        isValid: false,
        error: {
          status: 500,
          message: "Error validating users",
          error: error.message,
        },
      };
    }
  };

  /**
   * Checks if the requested time slot overlaps with existing appointments
   * @param {string} professorId - Professor's ID
   * @param {string} date - Appointment date
   * @param {string} startTime - Start time of slot
   * @param {string} endTime - End time of slot
   * @returns {Promise<Object>} Overlap check result
   */
  const checkOverlappingAppointments = async (
    professorId,
    date,
    startTime,
    endTime
  ) => {
    const overlapping = await Appointment.findOne({
      professor: professorId,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (overlapping) {
      return {
        hasOverlap: true,
        error: {
          status: 400,
          message: "This time slot overlaps with an existing appointment",
        },
      };
    }

    return { hasOverlap: false };
  };

  try {
    // Validate input data
    const dataValidation = validateAppointmentData();
    if (!dataValidation.isValid) {
      return res.status(dataValidation.error.status).json(dataValidation.error);
    }

    // Validate users
    const userValidation = await validateUsers(studentId, professorId);
    if (!userValidation.isValid) {
      return res.status(userValidation.error.status).json(userValidation.error);
    }

    // Check for overlapping appointments
    const overlapCheck = await checkOverlappingAppointments(
      professorId,
      date,
      startTime,
      endTime
    );
    if (overlapCheck.hasOverlap) {
      return res.status(overlapCheck.error.status).json(overlapCheck.error);
    }

    // Create and save new appointment
    const newAppointment = new Appointment({
      student: studentId,
      professor: professorId,
      startTime,
      endTime,
      date,
      day,
    });

    await newAppointment.save();

    return res.status(201).json({
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Retrieves all booked appointments for a student
 *
 * @async
 * @function getAppointments
 * @param {Object} req - Express request object
 * @param {string} req.query.studentId - ID of the student
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON response with appointments
 */
const getAppointments = async (req, res) => {
  try {
    const { studentId } = req.query;
    const appointments = await Appointment.find({
      student: studentId,
      status: "booked",
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments.", error });
  }
};

module.exports = { viewAvailability, bookAppointment, getAppointments };
