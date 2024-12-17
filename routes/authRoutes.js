// /routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
// this is just a route to test the authMiddleware when I send a req from postman
// as a professor I should get "Hello Professor, you're authoraized" and same is true
// for a student but there's a problem with this authmiddleware or with the login 
// controller with which I'm setting the token on user's side 
// can you tell me what is it that I'm doing wrong and I've also provided some
// results of debugging log statements for more accurate hints.
// Please tell me what is wrong.
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.role}, you are authorized!` });
});

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

module.exports = router;
