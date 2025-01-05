# College Appointment System

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technical Stack](#technical-stack)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Seeding the Database](#seeding-the-database)
  - [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Student Routes](#student-routes)
  - [Professor Routes](#professor-routes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a College Appointment System that allows students to book appointments with professors. It includes user authentication, appointment management, and availability scheduling.

## System Architecture

The system follows a RESTful architecture with:

- Authentication Layer (JWT-based)
- Business Logic Layer
- Data Access Layer
- Error Handling Middleware
- Input Validation Layer

## Technical Stack

- **Backend**: Node.js v18.x + Express.js
- **Database**:
  - Development: MongoDB
  - Production: AWS DocumentDB
- **Authentication**: JWT + Cookie Sessions
- **Testing**: Jest + Supertest
- **Documentation**: JSDoc
- **Process Manager**: PM2 (Production)

## Installation Guide

### Prerequisites

- Node.js v18.x or higher
- MongoDB (running locally or a cloud instance)
- Git
- npm or yarn

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

3. Create environment files:

   ```bash
   touch .env.development .env.production
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

## Configuration

### Development Environment (.env.development)

```plaintext
PORT=5000
MONGO_URI="mongodb://127.0.0.1:27017/college-appointment-system"
JWT_SECRET=your_development_secret
NODE_ENV="development"
```

### Production Environment (.env.production)

```plaintext
PORT=5000
MONGO_URI="mongodb://<username>:<password>@<documentdb-cluster-endpoint>:27017/<database-name>?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
JWT_SECRET=your_production_secret
NODE_ENV="production"
CA_CERT_PATH="/path/to/global-bundle.pem"
```

## Database Setup

### Local Development

```bash
# Start MongoDB
mongod --dbpath /path/to/data/db

# Seed Database (Optional)
npm run seed
```

### AWS DocumentDB Setup

1. Create DocumentDB cluster in AWS Console
2. Configure Security Groups
3. Download SSL certificate
4. Update connection string in .env.production

## API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "professor|student"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Student Routes

#### View Availability

```http
GET /api/student/availability
Authorization: Bearer {token}
Content-Type: application/json

{
  "professorId": "string"
}
```

#### Book Appointment

```http
POST /api/student/book
Authorization: Bearer {token}
Content-Type: application/json

{
  "professorId": "string",
  "startTime": "ISO DateTime",
  "endTime": "ISO DateTime",
  "date": "ISO Date",
  "day": "string"
}
```

#### Get Appointments

```http
GET /api/student/appointments
Authorization: Bearer {token}
Content-Type: application/json
```

### Professor Routes

#### Add Availability

```http
POST /api/professor/availability
Authorization: Bearer {token}
Content-Type: application/json

{
  "startTime": "ISO DateTime",
  "endTime": "ISO DateTime",
  "day": "string"
}
```

#### Get Availability

```http
GET /api/professor/availability/:professorId
Authorization: Bearer {token}
Content-Type: application/json
```

#### Cancel Appointment

```http
PUT /api/professor/cancel-appointment/:appointmentId
Authorization: Bearer {token}
Content-Type: application/json
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- auth.test.js

# Run with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run E2E tests
npm run test:e2e
```

## Deployment

### AWS EC2 Deployment

1. Launch EC2 instance
2. Configure Security Groups
3. Install Node.js and PM2

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Start Application
pm2 start app.js --name "college-appointment-system"
```

### Monitoring

```bash
# View logs
pm2 logs

# Monitor application
pm2 monit

# View status
pm2 status
```
