const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: String, // Store "10:00 AM" format
      required: true,
    },
    endTime: {
      type: String, // Store "11:00 AM" format
      required: true,
    },
    date: {
      type: String, // Store "2024-12-20" as a simple string
      required: true,
    },
    day: {
      type: String, // Store the day name like "Monday"
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
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Compound index to prevent overlapping appointments for a professor
appointmentSchema.index(
  { professor: 1, date: 1, startTime: 1 },
  { unique: true }
);

// Pre-save hook to ensure updatedAt is always updated
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
