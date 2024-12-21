/**
 * @fileoverview Authentication Middleware
 * /middlewares/authMiddleware.js
 * Middleware to verify JWT tokens and protect routes
 *
 * @requires jsonwebtoken
 * @requires dotenv
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Authentication Middleware
 * Verifies JWT token from cookies and attaches user data to request
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @throws {401} If token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
  try {
    // Verify token exists in cookies
    if (!req.cookies || !req.cookies.token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    // Extract and verify token
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
