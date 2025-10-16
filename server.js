require("dotenv").config();
const express = require("express");
const path = require("path");
const bookRoutes = require("./src/routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/books", bookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Book List API running on port ${PORT}`);
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
