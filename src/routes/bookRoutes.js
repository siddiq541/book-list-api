const express = require("express");
const router = express.Router();

const {
  getBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

router.get("/", getBooks);
router.post("/", addBook);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook)

module.exports = router;
