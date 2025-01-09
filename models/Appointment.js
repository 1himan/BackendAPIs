const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Instead of professor & student, we'll have participants
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Who initiated the appointment
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentType: {
      type: String,
      enum: ["professor-student", "warden-warden"],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "canceled", "completed"],
      default: "booked",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Updated index to prevent overlapping appointments for any participant
appointmentSchema.index(
  { participants: 1, date: 1, startTime: 1 },
  { unique: true }
);

appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add validation middleware to ensure correct participant roles
appointmentSchema.pre("save", async function (next) {
  if (this.appointmentType === "professor-student") {
    // Validate professor-student appointment
    const users = await mongoose.model("User").find({
      _id: { $in: this.participants },
    });

    const hasStudent = users.some((user) => user.role === "student");
    const hasProfessor = users.some((user) => user.role === "professor");

    if (!hasStudent || !hasProfessor || users.length !== 2) {
      throw new Error(
        "Professor-student appointments must have exactly one professor and one student"
      );
    }
  } else if (this.appointmentType === "warden-warden") {
    // Validate warden-warden appointment
    const users = await mongoose.model("User").find({
      _id: { $in: this.participants },
    });

    const allWardens = users.every((user) => user.role === "warden");
    if (!allWardens || users.length !== 2) {
      throw new Error("Warden appointments must have exactly two wardens");
    }
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);

// {
//   participants: [
//     "65bb8c71e74d4a2f9b123456",  // First warden's ObjectId
//     "65bb8c71e74d4a2f9b789012"   // Second warden's ObjectId
//   ],
//   initiator: "65bb8c71e74d4a2f9b123456", // Who created the appointment
//   appointmentType: "warden-warden",
//   startTime: "10:00 AM",
//   endTime: "11:00 AM",
//   date: "2024-01-07",
//   day: "Monday",
//   status: "booked",
//   createdAt: "2024-01-07T10:00:00.000Z",
//   updatedAt: "2024-01-07T10:00:00.000Z"
// }