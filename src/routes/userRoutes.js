const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers, 
  addUser, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require("../controllers/userController");
const auth = require("../middleware/auth");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// CRUD routes
router.post("/", addUser);           // Create user
router.get("/", getUsers);           // Get all users
router.get("/:id", getUserById);     // Get user by ID
router.put("/:id", updateUser);      // Update user
router.delete("/:id", deleteUser);   // Delete user

// Protected route
router.get("/profile", auth, getUserProfile);

module.exports = router;