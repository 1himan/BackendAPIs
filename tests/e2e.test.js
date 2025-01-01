/**
 * @fileoverview Integration Tests for College Appointment System
 * Tests the complete flow of professor availability and student appointment booking
 *
 * @requires supertest - HTTP assertion library
 * @requires mongoose - MongoDB ODM
 * @requires ../app - Express application
 * @requires ../models/User - User model
 * @requires ../models/Availability - Availability model
 * @requires ../models/Appointment - Appointment model
 */

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

describe("College Appointment System API Tests", () => {
  // Test user authentication tokens
  let professorToken, studentA1Token, studentA2Token;
  // Test user IDs
  let professorId, studentA1Id, studentA2Id;

  /**
   * Test Setup
   * - Connects to test database
   * - Clears all collections
   * - Creates test users (1 professor, 2 students)
   * - Generates authentication tokens
   */
  beforeAll(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb://localhost:27017/test-db");
    }

    // Clean test database
    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});

    // Register test users
    const users = await Promise.all([
      // Create professor account
      request(app).post("/api/auth/register").send({
        name: "Professor P1",
        email: "professor.p1@example.com",
        password: "password123",
        role: "professor",
      }),
      // Create first student account
      request(app).post("/api/auth/register").send({
        name: "Student A1",
        email: "student.a1@example.com",
        password: "password123",
        role: "student",
      }),
      // Create second student account
      request(app).post("/api/auth/register").send({
        name: "Student A2",
        email: "student.a2@example.com",
        password: "password123",
        role: "student",
      }),
    ]);

    // Store user IDs for later use
    professorId = users[0].body.user._id;
    studentA1Id = users[1].body.user._id;
    studentA2Id = users[2].body.user._id;

    // Login and get authentication tokens
    const logins = await Promise.all([
      request(app).post("/api/auth/login").send({
        email: "professor.p1@example.com",
        password: "password123",
      }),
      request(app).post("/api/auth/login").send({
        email: "student.a1@example.com",
        password: "password123",
      }),
      request(app).post("/api/auth/login").send({
        email: "student.a2@example.com",
        password: "password123",
      }),
    ]);

    // Extract tokens from login responses
    professorToken = extractTokenFromCookie(logins[0]);
    studentA1Token = extractTokenFromCookie(logins[1]);
    studentA2Token = extractTokenFromCookie(logins[2]);
  });

  /**
   * Helper function to extract JWT token from cookie
   * @param {Object} response - HTTP response object
   * @returns {string} JWT token
   */
  function extractTokenFromCookie(response) {
    const cookie = response.headers["set-cookie"][0];
    return cookie.split(";")[0].split("=")[1];
  }

  /**
   * Test Case: Professor Availability Creation
   * Verifies that a professor can successfully add available time slots
   */
  it("should allow Professor P1 to add availability slots", async () => {
    const res = await request(app)
      .post("/api/professor/availability")
      .set("Cookie", `token=${professorToken}`)
      .send({
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        date: "2025-12-20",
        day: "Monday",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Availability added successfully.");
  });

  /**
   * Test Case: Student Availability View
   * Verifies that students can view professor's available time slots
   */
  it("should allow Student A1 to view professor's availability", async () => {
    const res = await request(app)
      .get(`/api/student/availability?professorId=${professorId}`)
      .set("Cookie", `token=${studentA1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  /**
   * Test Case: Student Appointment Booking
   * Verifies that Student A1 can successfully book an appointment
   */
  it("should allow Student A1 to book an appointment", async () => {
    const res = await request(app)
      .post("/api/student/book")
      .set("Cookie", `token=${studentA1Token}`)
      .send({
        professorId: professorId,
        studentId: studentA1Id,
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        date: "2025-12-23",
        day: "Monday",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully.");
  });

  /**
   * Test Case: Multiple Student Bookings
   * Verifies that Student A2 can book a different time slot
   */
  it("should allow Student A2 to book another appointment", async () => {
    const res = await request(app)
      .post("/api/student/book")
      .send({
        studentId: `${studentA2Id}`,
        professorId: `${professorId}`,
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        date: "2025-12-23",
        day: "Monday",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully.");
    expect(res.body.appointment).toHaveProperty("startTime", "11:00 AM");
    expect(res.body.appointment).toHaveProperty("endTime", "12:00 PM");
  });

  /**
   * Test Case: Professor Appointment Cancellation
   * Verifies that a professor can cancel a student's appointment
   */
  it("should allow Professor P1 to cancel Student A1's appointment", async () => {
    // Fetch all appointments for Student A1
    const appointmentRes = await request(app)
      .get("/api/student/appointments")
      .set("Cookie", `token=${studentA1Token}`);

    // Ensure appointments exist and extract the first appointment ID
    console.log(appointmentRes.body);
    const appointmentId = appointmentRes.body[0]?._id;
    console.log(appointmentId);
    if (!appointmentId) throw new Error("No appointment found to cancel");

    // Cancel the appointment using the professor's token
    const cancelRes = await request(app)
      .put(`/api/professor/cancel-appointment/${appointmentId}`)
      .set("Cookie", `token=${professorToken}`);

    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.message).toBe("Appointment canceled successfully.");
  });

  /**
   * Test Case: Cancellation Verification
   * Verifies that the canceled appointment shows correct status
   */
  it("should confirm Student A1's appointment is canceled", async () => {
    const res = await request(app)
      .get("/api/student/appointments")
      .set("Cookie", `token=${studentA1Token}`);
    expect(res.body[0]?.status).toBe("canceled");
  });

  /**
   * Cleanup
   * Closes MongoDB connection after all tests complete
   */
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
