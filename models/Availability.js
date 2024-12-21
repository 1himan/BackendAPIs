/**
 * @fileoverview Availability Model Definition
 * Defines the schema for professor availability time slots
 *
 * @requires mongoose
 * @module models/Availability
 */

const mongoose = require("mongoose");

/**
 * Availability Schema
 * Represents a time slot when a professor is available for appointments
 *
 * @typedef {Object} AvailabilitySchema
 * @property {ObjectId} professor - Reference to the professor's User document
 * @property {String} startTime - Start time of availability slot (e.g., "10:00 AM")
 * @property {String} endTime - End time of availability slot (e.g., "11:00 AM")
 * @property {Date} date - Date of the availability slot
 * @property {String} day - Day of the week (e.g., "Monday")
 */
const availabilitySchema = new mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  date: { type: Date, required: true },
  day: { type: String, required: true }, // Add the day field
});

/**
 * Compound Index Definition
 * Ensures a professor cannot have multiple overlapping availability slots
 * Creates a unique constraint on professor, startTime, and endTime combination
 *
 * @index {professor: 1, startTime: 1, endTime: 1}
 * @unique
 */
availabilitySchema.index(
  { professor: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

/**
 * Exports the Availability model
 * @exports Availability
 */
module.exports = mongoose.model("Availability", availabilitySchema);
