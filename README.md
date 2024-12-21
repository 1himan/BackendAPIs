# College Appointment System

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Seeding the Database](#seeding-the-database)
  - [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Student Routes](#student-routes)
  - [Professor Routes](#professor-routes)

## Overview

This project is a College Appointment System that allows students to book appointments with professors. It includes user authentication, appointment management, and availability scheduling.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a cloud instance)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/1himan/BackendAPIs.git
   cd college-appointment-system
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```plaintext
   PORT=5000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   MONGO_URI="mongodb://127.0.0.1:27017/db-name"
   ```

### Running the Application

1. Start the MongoDB server if it's not already running.
2. Run the application:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`.

### Seeding the Database

To initialize the database with some dummy data, run:

```bash
npm run seed
```

### Running Tests

To run the integration tests, use:

```bash
npm test
```

## API Endpoints

- ### Authentication

  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Log in a user
  - `GET /api/auth/protected` - Protected route to test authentication

- ### Student Routes

  - `GET /api/student/availability` - View available time slots
  - `POST /api/student/book` - Book an appointment
  - `GET /api/student/appointments` - Get all appointments for a student

- ### Professor Routes
  - `POST /api/professor/availability` - Add availability slots
  - `GET /api/professor/availability/:professorId` - Get availability for a specific professor
  - `PUT /api/professor/cancel-appointment/:appointmentId` - Cancel an appointment
