require("dotenv").config();
const db = require("../db");

const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${process.env.API_KEY}`
    );

    const data = await response.json();
    const books = data.items?.map((item) => ({
      google_books_id: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || "",
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      published_date: item.volumeInfo.publishedDate || "",
    })) || [];
    res.json(books);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error searching books",
    });
  }
};

const addToLibrary = async (req, res) => {
  try {
    //TEMP hardcoded user id until we implement auth
    const userId = 1;
    const { google_books_id, title, authors, description, thumbnail, published_date } = req.body;
    
    if (!google_books_id || !title) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const existingBook = await db.query("SELECT * FROM user_books WHERE user_id = $1 AND google_books_id = $2", [userId, google_books_id]);
    if (existingBook.rows.length > 0) {
      return res.status(400).json({
        message: "Book already in library",
      });
    }

    await db.query(
      "INSERT INTO user_books (user_id, google_books_id, title, authors, description, thumbnail, published_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [userId, google_books_id, title, authors, description, thumbnail, published_date]
    );

    res.status(201).json({
      message: "Book added to library",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error adding book to library",
    });
  }
};

module.exports = { searchBooks, addToLibrary };