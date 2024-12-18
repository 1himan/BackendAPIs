// authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  try {
    // Check for token in cookies
    // console.log(req.cookies)
    if (!req.cookies || !req.cookies.token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    // Extract token from cookies
    const token = req.cookies.token;
    // console.log(token);
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to the request object
    req.user = decoded;
    // console.log(decoded)

    // Call next middleware
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
