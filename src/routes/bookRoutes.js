const express = require("express");
const router = express.Router();

let books = [];
let nextId = 1;

// Get all books
router.get("/", (req, res) => {
  res.json(books);
});

// Get a book by ID
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Add a new book
router.post("/", (req, res) => {
  const { title, author, read } = req.body;
  const newBook = { id: nextId++, title, author, read };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Edit a book
router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  const { title, author, read } = req.body;
  book.title = title ?? book.title;
  book.author = author ?? book.author;
  book.read = read ?? book.read;
  res.json(book);
});

// Delete book by ID
router.delete("/:id", (req, res) => {
  books = books.filter((b) => b.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = router;
