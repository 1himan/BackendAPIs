const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Import your Express app
const User = require("../models/User");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

let professorToken, studentA1Token, studentA2Token;
let professorId, studentA1Id, studentA2Id;
beforeAll(async () => {
  // Connect to the test database
  // Use a single connection for the test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb://localhost:27017/test-db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Clear all data from collections
  await User.deleteMany({});
  await Availability.deleteMany({});
  await Appointment.deleteMany({});
  // Create Professor P1 and get token
  const professor = await request(app).post("/api/auth/signup").send({
    name: "Professor P1",
    email: "professor.p1@example.com",
    password: "password123",
    role: "professor",
  });
  professorId = professor.body.user._id;

  const professorLogin = await request(app).post("/api/auth/login").send({
    email: "professor.p1@example.com",
    password: "password123",
  });
  professorToken = professorLogin.body.token;

  // Create Student A1
  const studentA1 = await request(app).post("/api/auth/signup").send({
    name: "Student A1",
    email: "student.a1@example.com",
    password: "password123",
    role: "student",
  });
  studentA1Id = studentA1.body.user._id;

  const studentA1Login = await request(app).post("/api/auth/login").send({
    email: "student.a1@example.com",
    password: "password123",
  });
  studentA1Token = studentA1Login.body.token;

  // Created Student A2
  const studentA2 = await request(app).post("/api/auth/signup").send({
    name: "Student A2",
    email: "student.a2@example.com",
    password: "password123",
    role: "student",
  });
  studentA2Id = studentA2.body.user._id;

  const studentA2Login = await request(app).post("/api/auth/login").send({
    email: "student.a2@example.com",
    password: "password123",
  });
  studentA2Token = studentA2Login.body.token;
});

describe("College Appointment System API Tests", () => {
  it("should allow Professor P1 to add availability slots", async () => {
    const res = await request(app)
      .post("/api/professor/availability")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        date: "2024-12-20",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Availability added successfully.");
  });

  it("should allow Student A1 to view professor's availability", async () => {
    const res = await request(app)
      .get(`/api/professor/${professorId}/availability`)
      .set("Authorization", `Bearer ${studentA1Token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should allow Student A1 to book an appointment", async () => {
    const res = await request(app)
      .post("/api/student/appointment")
      .set("Authorization", `Bearer ${studentA1Token}`)
      .send({
        professor: professorId,
        time: "2024-12-20T10:00:00.000Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully.");
  });

  it("should allow Student A2 to book another appointment", async () => {
    const res = await request(app)
      .post("/api/student/appointment")
      .set("Authorization", `Bearer ${studentA2Token}`)
      .send({
        professor: professorId,
        time: "2024-12-20T11:00:00.000Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully.");
  });

  it("should allow Professor P1 to cancel Student A1's appointment", async () => {
    const appointmentRes = await request(app)
      .get("/api/student/appointments")
      .set("Authorization", `Bearer ${studentA1Token}`);

    const appointmentId = appointmentRes.body[0]._id;

    const cancelRes = await request(app)
      .patch(`/api/professor/appointment/${appointmentId}/cancel`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.message).toBe("Appointment canceled successfully.");
  });

  it("should confirm Student A1's appointment is canceled", async () => {
    const res = await request(app)
      .get("/api/student/appointments")
      .set("Authorization", `Bearer ${studentA1Token}`);

    expect(res.body[0].status).toBe("canceled");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
