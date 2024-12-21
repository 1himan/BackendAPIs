/**
 * @fileoverview Authentication Routes Configuration
 * /routes/authRoutes.js
 * Defines the authentication-related routes and their handlers
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Protected Route - Tests authentication
 * @route GET /api/auth/protected
 * @middleware authMiddleware - Verifies JWT token
 * @returns {Object} Success message with user role
 * @access Private
 */
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.role}, you are authorized!` });
});

/**
 * User Registration Route
 * @route POST /api/auth/register
 * @param {Object} req.body.name - User's full name
 * @param {Object} req.body.email - User's email address
 * @param {Object} req.body.password - User's password
 * @param {Object} req.body.role - User's role (e.g., 'student', 'professor')
 * @returns {Object} User data and JWT token in cookie
 * @access Public
 */
router.post("/register", authController.register);

/**
 * User Login Route
 * @route POST /api/auth/login
 * @param {Object} req.body.email - User's email address
 * @param {Object} req.body.password - User's password
 * @returns {Object} User data and JWT token in cookie
 * @access Public
 */
router.post("/login", authController.login);

module.exports = router;
