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
    //     {
    //     "message": "Login successful.",
    //     "user": {
    //         "_id": "6779095bcd14fb33fdd781df",
    //         "name": "Professor John Doe",
    //         "email": "john.doe@university.com",
    //         "role": "professor"
    //     }
    // }
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzkwOTViY2QxNGZiMzNmZGQ3ODFkZiIsInJvbGUiOiJwcm9mZXNzb3IiLCJpYXQiOjE3MzU5ODkwMTEsImV4cCI6MTczNjA3NTQxMX0.nJ9i1i4HjV35DKa7rh6WiUiVKT6sjqn8Xf6m59JIyBA

    const student1 = await User.create({
      name: "Student Jane Smith",
      email: "jane.smith@student.com",
      password: "password123", // Will be hashed by pre-save middleware
      role: "student",
    });
    //     {
    //     "message": "Login successful.",
    //     "user": {
    //         "_id": "67790d26cd14fb33fdd781e3",
    //         "name": "Student Jane Smith",
    //         "email": "jane.smith@student.com",
    //         "role": "student"
    //     }
    // }
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzkwZDI2Y2QxNGZiMzNmZGQ3ODFlMyIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM1OTg4ODMxLCJleHAiOjE3MzYwNzUyMzF9.94eFQ4B1dwmfVuFJswxNr18gUFt7668L6-HTBfaj8hE
    const student2 = await User.create({
      name: "Student John Cena",
      email: "john.cena@student.com",
      password: "password123",
      role: "student",
    });
    // {
    //     "message": "User registered successfully.",
    //     "user": {
    //         "_id": "677916b4cd14fb33fdd781e9",
    //         "name": "Student John Cena",
    //         "email": "john.cena@student.com",
    //         "role": "student"
    //     }
    // }
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzkxNmI0Y2QxNGZiMzNmZGQ3ODFlOSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM1OTg4OTE2LCJleHAiOjE3MzYwNzUzMTZ9.SjPMkYAamlSm1quQ5XGlfeCZIQfuXTR_0pZKGHUDK5I
    console.log("Added users:", professor, student1, student2);

    console.log("Dummy data initialized successfully!");
    process.exit(0); // Exit the process after seeding
  } catch (error) {
    console.error("Error initializing data:", error);
    process.exit(1); // Exit the process with failure
  }
};

initializeData();
