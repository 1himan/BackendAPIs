// controllers/studentController.js
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

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

// book an appointment
const bookAppointment = async (req, res) => {
  const { studentId, professorId, startTime, endTime, date, day } = req.body;

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

    // Create and save appointment
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


// controllers/studentController.js
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
