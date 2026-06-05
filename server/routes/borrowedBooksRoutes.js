const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createBorrowedBook, getBorrowedBooks, getBorrowedBookById, updateBorrowedBook, returnBorrowedBook, deleteBorrowedBook } = require("../controllers/borrowedBooksController");

router.post("/", authMiddleware, createBorrowedBook);
router.get("/", authMiddleware, getBorrowedBooks);
router.get("/:id", authMiddleware, getBorrowedBookById);
router.patch("/:id", authMiddleware, updateBorrowedBook);
router.patch("/:id/return", authMiddleware, returnBorrowedBook);
router.delete("/:id", authMiddleware, deleteBorrowedBook);

module.exports = router;