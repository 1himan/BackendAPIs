/**
 * @fileoverview User Model Definition
 * Defines the schema and methods for User entities in the system
 *
 * @requires mongoose - MongoDB object modeling tool
 * @requires bcryptjs - Password hashing library
 * @module models/User
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema
 * Represents a user in the system (either student or professor)
 *
 * @typedef {Object} UserSchema
 * @property {String} name - User's full name
 * @property {String} email - Unique email address with basic format validation
 * @property {String} password - Hashed password (never stored in plain text)
 * @property {String} role - User role, limited to either "student" or "professor"
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /.+@.+\..+/ },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "professor"], required: true },
});

/**
 * Password Hash Middleware
 * Automatically hashes the password before saving if it has been modified
 * Uses bcrypt with a salt factor of 10
 *
 * @pre save - Executes before saving the document
 * @async
 * @function
 * @param {Function} next - Middleware callback
 */
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

/**
 * Compare Password Method
 * Verifies if the provided password matches the stored hash
 *
 * @async
 * @method
 * @param {string} password - Plain text password to compare
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Exports the User model
 * @exports User
 */
module.exports = mongoose.model("User", userSchema);
