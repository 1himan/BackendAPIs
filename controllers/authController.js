/**
 * @fileoverview Authentication Controller
 * /controllers/authController.js
 * Handles user registration and login logic
 *
 * @requires ../models/User
 * @requires jsonwebtoken
 * @requires dotenv
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Register a new user
 * Creates a new user account and generates JWT token
 *
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {string} req.body.role - User's role
 * @param {Object} res - Express response object
 * @returns {Object} Created user data and JWT token in cookie
 * @throws {400} If email already exists
 * @throws {500} If server error occurs
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // Create and save new user
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Generate and set JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24hrs" }
    );

    // Set secure cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
};

/**
 * Login user
 * Authenticates user credentials and generates JWT token
 *
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} User data and JWT token in cookie
 * @throws {404} If user not found
 * @throws {401} If invalid credentials
 * @throws {500} If server error occurs
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find and validate user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate and set JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24hrs" }
    );

    // Set secure cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
};

module.exports = { register, login };

// scp -i "C:\1himan\Personal Documents\indudidishaludidi.pem" global-bundle.pem ec2-user@13.201.95.230:~/
// ssh -i C:\1himan\Personal Documents\indudidishaludidi.pem ubuntu@13.201.95.230