const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

describe("College Appointment System API Tests", () => {
  // Remove global variables and declare them within the scope
  let professorToken, studentA1Token, studentA2Token;
  let professorId, studentA1Id, studentA2Id;

  beforeAll(async () => {
    // Connect to the test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb://localhost:27017/test-db");
    }

    // Clear all data from collections
    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});

    // Prepare test users
    const users = await Promise.all([
      // Register Professor
      request(app).post("/api/auth/register").send({
        name: "Professor P1",
        email: "professor.p1@example.com",
        password: "password123",
        role: "professor",
      }),
      // Register Student A1
      request(app).post("/api/auth/register").send({
        name: "Student A1",
        email: "student.a1@example.com",
        password: "password123",
        role: "student",
      }),
      // Register Student A2
      request(app).post("/api/auth/register").send({
        name: "Student A2",
        email: "student.a2@example.com",
        password: "password123",
        role: "student",
      }),
    ]);

    // Extract and set user details
    professorId = users[0].body.user._id;
    studentA1Id = users[1].body.user._id;
    studentA2Id = users[2].body.user._id;

    // Login and get tokens
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

    // Set tokens from login responses
    professorToken = extractTokenFromCookie(logins[0]);
    studentA1Token = extractTokenFromCookie(logins[1]);
    studentA2Token = extractTokenFromCookie(logins[2]);
  });

  // Helper function to extract token from cookie
  function extractTokenFromCookie(response) {
    const cookie = response.headers["set-cookie"][0];
    return cookie.split(";")[0].split("=")[1];
  }

  it("should allow Professor P1 to add availability slots", async () => {
    const res = await request(app)
      .post("/api/professor/availability")
      .set("Cookie", `token=${professorToken}`)
      .send({
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        date: "2024-12-20",
        day: "Monday",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Availability added successfully.");
  });

  it("should allow Student A1 to view professor's availability", async () => {
    const res = await request(app)
      .get(`/api/student/availability?professorId=${professorId}`)
      .set("Cookie", `token=${studentA1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it("should allow Student A1 to book an appointment", async () => {
    const res = await request(app)
      .post("/api/student/book")
      .set("Cookie", `token=${studentA1Token}`)
      .send({
        professorId: professorId,
        studentId: studentA1Id,
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        date: "2024-12-20",
        day: "Monday",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully.");
    // expect(res.body.appointment).toHaveProperty("startTime", "10:00 AM");
    // expect(res.body.appointment).toHaveProperty("endTime", "11:00 AM");
    // expect(res.body.appointment).toHaveProperty("date", "2024-12-20");
    // expect(res.body.appointment).toHaveProperty("day", "Monday");
    // expect(res.body.appointment).toHaveProperty("status", "booked");
  });
  it("should allow Student A2 to book another appointment", async () => {
    const res = await request(app).post("/api/student/book").send({
      studentId: "67629962f4f392de2d2c39c5",
      professorId: "67629962f4f392de2d2c39c0",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      date: "2024-12-20",
      day: "Monday",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully.");
    expect(res.body.appointment).toHaveProperty("startTime", "11:00 AM");
    expect(res.body.appointment).toHaveProperty("endTime", "12:00 PM");
  });

  it("should allow Professor P1 to cancel Student A1's appointment", async () => {
    // Fetch all appointments for Student A1
    const appointmentRes = await request(app)
      .get("/api/student/appointments")
      .set("Cookie", `token=${studentA1Token}`);

    // Ensure appointments exist and extract the first appointment ID
    const appointmentId = appointmentRes.body[0]?._id;
    if (!appointmentId) throw new Error("No appointment found to cancel");

    // Cancel the appointment using the professor's token
    const cancelRes = await request(app)
      .put(`/api/professor/cancel-appointment/${appointmentId}`)
      .set("Cookie", `token=${professorToken}`);

    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.message).toBe("Appointment canceled successfully.");
  });

  it("should confirm Student A1's appointment is canceled", async () => {
    const res = await request(app)
      .get("/api/student/appointments")
      .set("Cookie", `token=${studentA1Token}`);

    expect(res.body[0]?.status).toBe("canceled");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
