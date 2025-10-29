const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true }, // if fetched from Google API
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String },
    description: { type: String },
    source: { type: String, enum: ["google", "manual"], default: "manual" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
