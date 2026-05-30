const express = require("express");
const router = express.Router();

const { getAllBooks, getCollectionBooks } = require("../controllers/libraryController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getAllBooks);
router.get("/:collection", authMiddleware, getCollectionBooks);

module.exports = router;