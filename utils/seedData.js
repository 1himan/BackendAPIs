const mongoose = require("mongoose");
const User = require("../models/User");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

const initializeData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://localhost:27017/college-appointment-system"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});
    console.log("Cleared existing data");

    // Add users
    const professor = await User.create({
      name: "Professor John Doe",
      email: "john.doe@university.com",
      password: "password123", // Will be hashed by pre-save middleware
      role: "professor",
    });

    const student1 = await User.create({
      name: "Student Jane Smith",
      email: "jane.smith@student.com",
      password: "password123", // Will be hashed by pre-save middleware
      role: "student",
    });
    const student2 = await User.create({
      name: "Student John Cena",
      email: "john.cena@student.com",
      password: "password123",
      role: "student",
    });

    console.log("Added users:", professor, student1, student2);

    console.log("Dummy data initialized successfully!");
    process.exit(0); // Exit the process after seeding
  } catch (error) {
    console.error("Error initializing data:", error);
    process.exit(1); // Exit the process with failure
  }
};

initializeData();
