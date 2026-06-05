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

    if (!["favorites", "currently-reading", "to-read", "loaned-out", "borrowed-books"].includes(collection)) {
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

    if (collection === "loaned-out") {
      const books = await db.query(
        "SELECT * FROM user_books ub WHERE ub.user_id = $1 AND EXISTS (SELECT 1 FROM loans l WHERE l.user_book_id = ub.id AND l.returned_date IS NULL)",
        [userId]
      );
      return res.json(books.rows);
    }

    if (collection === "borrowed-books") {
      const books = await db.query(
        "SELECT bb.*, c.name AS lender_name FROM borrowed_books bb LEFT JOIN contacts c ON bb.contact_id = c.id WHERE bb.user_id = $1 AND bb.returned_date IS NULL",
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