const express = require("express");
const router = express.Router();

const { searchBooks, addToLibrary, getBookById, updateBook, deleteBook } = require("../controllers/booksController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/search", authMiddleware, searchBooks);

router.get("/:google_books_id", authMiddleware, getBookById);
router.post("/", authMiddleware, addToLibrary);
router.put("/:google_books_id", authMiddleware, updateBook);
router.delete("/:google_books_id", authMiddleware, deleteBook);

module.exports = router;