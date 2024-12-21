/**
 * @fileoverview Appointment Model Definition
 * Defines the schema for appointment scheduling between professors and students
 *
 * @requires mongoose
 * @module models/Appointment
 */

const mongoose = require("mongoose");

/**
 * Appointment Schema
 * Represents a scheduled appointment between a professor and a student
 *
 * @typedef {Object} AppointmentSchema
 */
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

/**
 * Compound Index Definition
 * Prevents overlapping appointments for a professor on the same date and time
 *
 * @index {professor: 1, date: 1, startTime: 1}
 * @unique
 */
appointmentSchema.index(
  { professor: 1, date: 1, startTime: 1 },
  { unique: true }
);

/**
 * Pre-save middleware
 * Updates the updatedAt timestamp before each save operation
 *
 * @pre save
 */
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Exports the Appointment model
 * @exports Appointment
 */
module.exports = mongoose.model("Appointment", appointmentSchema);
