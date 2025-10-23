const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route (you'll need to add auth middleware)
router.get("/profile", getUserProfile);

module.exports = router;