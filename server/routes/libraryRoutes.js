const express = require("express");
const router = express.Router();

const { searchBooks, addToLibrary, getAllBooks, getBookById } = require("../controllers/libraryController");

router.get("/search", searchBooks);

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", addToLibrary);
// router.put("/:id", updateBook);
// router.delete("/:id", deleteBook);

module.exports = router;