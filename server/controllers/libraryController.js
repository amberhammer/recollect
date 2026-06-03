require("dotenv").config();
const db = require("../db");

const getAllBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await db.query("SELECT * FROM user_books WHERE user_id = $1", [userId]);
    res.json(books.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching books",
    });
  }
};

const getCollectionBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { collection } = req.params;

    if (!["favorites", "currently-reading", "to-read", "borrowed", "borrowing"].includes(collection)) {
      return res.status(400).json({
        message: "Invalid collection",
      });
    }

    if (collection === "favorites") {
      const books = await db.query(
        "SELECT * FROM user_books WHERE user_id = $1 AND is_favorite = true",
        [userId]
      );
      return res.json(books.rows);
    }

    if (collection === "currently-reading") {
      const books = await db.query(
        "SELECT * FROM user_books WHERE user_id = $1 AND status = 'currently_reading'",
        [userId]
      );
      return res.json(books.rows);
    }

    if (collection === "to-read") {
      const books = await db.query(
        "SELECT * FROM user_books WHERE user_id = $1 AND status = 'to_read'",
        [userId]
      );
      return res.json(books.rows);
    }

    if (collection === "borrowed") {
      const books = await db.query(
        "SELECT * FROM user_books WHERE user_id = $1 AND status = 'borrowed'",
        [userId]
      );
      return res.json(books.rows);
    }

    if (collection === "borrowing") {
      const books = await db.query(
        "SELECT * FROM user_books WHERE user_id = $1 AND status = 'borrowing'",
        [userId]
      );
      return res.json(books.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching books",
    });
  }
};

module.exports = { getAllBooks, getCollectionBooks };