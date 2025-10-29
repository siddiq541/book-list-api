const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Book = require("../models/bookModel");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });
};

// Register user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("readingList.book", "title author coverImage");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add user (alias for register)
const addUser = async (req, res) => {
  // This can be the same as registerUser or a simplified version
  await registerUser(req, res);
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Don't allow password updates through this route
    if (updateData.password) {
      delete updateData.password;
    }

    // Check if email/username already exists (if being updated)
    if (updateData.email || updateData.username) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: id } }, // Exclude current user
          {
            $or: [
              { email: updateData.email },
              { username: updateData.username },
            ],
          },
        ],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email or username already exists",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: deletedUser,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user's reading list with favorite flag
const getReadingList = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "readingList.book"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      readingList: user.readingList,
      favorites: user.favorites, // add this
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add book to reading list

const addBookToReadingList = async (req, res) => {
  const { googleId, title, author, coverImage } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if book exists in books collection
    let book = await Book.findOne({ googleId });
    if (!book) {
      book = await Book.create({ googleId, title, author, coverImage });
    }

    // Check if already in user's reading list
    const exists = user.readingList.find(
      (b) => b.book.toString() === book._id.toString()
    );
    if (exists)
      return res.status(400).json({ message: "Book already in reading list" });

    // Add book reference with status
    user.readingList.push({ book: book._id, status: "want-to-read" });
    await user.save();

    res
      .status(201)
      .json({ message: "Book added", readingList: user.readingList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove book from reading list
const removeBookFromReadingList = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove the book from reading list
    user.readingList = user.readingList.filter(
      (b) => b.book.toString() !== bookId
    );

    // Also remove it from favorites if it's there
    user.favorites = user.favorites.filter((fav) => fav.toString() !== bookId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Book removed from reading list and favorites",
      readingList: user.readingList,
      favorites: user.favorites,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle favorite book
const toggleFavoriteBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favorites.includes(bookId)) {
      user.favorites = user.favorites.filter((id) => id.toString() !== bookId);
    } else {
      user.favorites.push(bookId);
    }

    await user.save();
    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    console.error("Toggle favorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update book status in reading list
const updateBookStatus = async (req, res) => {
  const { bookId, status } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the book in reading list
    const entry = user.readingList.find((b) => b.book.toString() === bookId);
    if (!entry)
      return res.status(404).json({ message: "Book not in reading list" });

    // Update status
    entry.status = status;
    await user.save();

    res
      .status(200)
      .json({ message: "Status updated", readingList: user.readingList });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};
