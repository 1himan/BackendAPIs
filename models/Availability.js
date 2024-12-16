const mongoose = require("mongoose");

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

// Compound index for unique professor and time slot
availabilitySchema.index(
  { professor: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);
