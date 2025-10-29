const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const bookRoutes = require("./src/routes/bookRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev
      "https://book-list-frontend-git-development-siddiqs-projects-9f9d6a84.vercel.app", // Vercel frontend
    ], // Vercel frontend
    credentials: true, // if sending cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

connectDB();

const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Book List API running on port ${PORT}`);
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
