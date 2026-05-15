require("dotenv").config();
const db = require("../db");
const moment = require('moment-timezone');

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
    const books = [];

    for (const item of data.items || []) {
      const transformedBook = {
        google_books_id: item.id,
        title: item.volumeInfo.title || "Unknown",
        authors: item.volumeInfo.authors || [],
        description: item.volumeInfo.description || "",
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        published_date: moment(item.volumeInfo.publishedDate).format("YYYY-MM-DD") || ""
      };

      const result = await db.query(
        `
        INSERT INTO books (
          google_books_id,
          title,
          authors,
          description,
          thumbnail,
          published_date
        )
        VALUES ($1, $2, $3, $4, $5, $6)

        ON CONFLICT (google_books_id)
        DO UPDATE SET
          title = EXCLUDED.title

        RETURNING *
        `,
        [
          transformedBook.google_books_id,
          transformedBook.title,
          transformedBook.authors,
          transformedBook.description,
          transformedBook.thumbnail,
          transformedBook.published_date
        ]
      );

      books.push(result.rows[0]);
    }
    res.json(books);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error searching books",
    });
  }
};

module.exports = { searchBooks };