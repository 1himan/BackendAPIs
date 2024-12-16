const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/protected", authController.authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.role}, you are authorized!` });
});

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

module.exports = router;
