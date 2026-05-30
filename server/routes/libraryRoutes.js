const express = require("express");
const router = express.Router();

const { searchBooks, addToLibrary, getAllBooks, getCollectionBooks, getBookById, updateBook, deleteBook } = require("../controllers/libraryController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/search", authMiddleware, searchBooks);

router.get("/", authMiddleware, getAllBooks);
router.get("/:collection", authMiddleware, getCollectionBooks);
router.get("/:google_books_id", authMiddleware, getBookById);
router.post("/", authMiddleware, addToLibrary);
router.put("/:google_books_id", authMiddleware, updateBook);
router.delete("/:google_books_id", authMiddleware, deleteBook);

module.exports = router;