// /routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.role}, you are authorized!` });
});

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

module.exports = router;
