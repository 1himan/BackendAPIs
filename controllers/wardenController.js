const Appointment = require("../models/Appointment");

const bookAppointment = async (req, res) => {
  try {
    const { startTime, endTime, date, day, participants } = req.body;

    // Ensure the user making the request is a warden
    if (req.user.role !== "warden") {
      return res
        .status(403)
        .json({ message: "Only wardens can book appointments." });
    }
    // Ensure the initiator is one of the participants
    if (!participants.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "The initiator must be one of the participants." });
    }

    // Validate required fields
    if (
      !startTime ||
      !endTime ||
      !date ||
      !participants ||
      participants.length !== 2
    ) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields." });
    }

    // Ensure the date is not in the past
    if (new Date(date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot book appointments in the past." });
    }

    // Ensure start time is before end time
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time." });
    }

    // Convert startTime and endTime to Date objects
    const startDate = new Date(`${date}T${startTime}`);
    const endDate = new Date(`${date}T${endTime}`);

    // Ensure both participants are wardens
    const users = await User.find({ _id: { $in: participants } });
    const allWardens = users.every((user) => user.role === "warden");
    if (!allWardens || users.length !== 2) {
      return res
        .status(400)
        .json({ message: "Participants must include exactly two wardens." });
    }

    // Check for overlapping appointments
    // participants.contains[WardenID] and startTime<T1 and endTime<T2
    const overlapping = await Appointment.findOne({
      participants: { $in: participants },
      // and
      date,
      // or
      $or: [{ startTime: { $lt: endDate }, endTime: { $gt: startDate } }],
    });

    if (overlapping) {
      return res.status(400).json({
        message: "This time slot overlaps with an existing appointment.",
      });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      participants,
      initiator: req.user._id,
      appointmentType: "warden-warden",
      startTime: startDate,
      endTime: endDate,
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

exports.bookAppointment = bookAppointment;
