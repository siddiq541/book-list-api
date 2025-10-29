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
  deleteUser,
  addBookToReadingList,
  removeBookFromReadingList,
  toggleFavoriteBook,
  getReadingList,
  updateBookStatus,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected routes first
router.get("/profile", auth, getUserProfile);
router.post("/reading-list", auth, addBookToReadingList);
router.post("/favorites", auth, toggleFavoriteBook);
router.get("/reading-list", auth, getReadingList);
router.put("/reading-list/status", auth, updateBookStatus);

router.delete("/reading-list/:bookId", auth, removeBookFromReadingList);
router.put("/favorite/:bookId", auth, toggleFavoriteBook);

// CRUD routes after protected ones
router.post("/", addUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
