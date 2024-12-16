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
    time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "canceled", "completed"], // added "completed" status
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

// Compound index to ensure unique appointments for a professor at a specific time
appointmentSchema.index({ professor: 1, time: 1 }, { unique: true });

// Pre-save hook to update the updatedAt field
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
