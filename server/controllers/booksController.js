require("dotenv").config();
const db = require("../db");
getGoogleBookById = require("../services/googleBooksService").getGoogleBookById;

const searchBooks = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${process.env.API_KEY}&maxResults=10`
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
        const userId = req.user.id;
        const { google_books_id, title, authors, description, thumbnail, published_date, status, rating, format } = req.body;
        console.log("Adding book to library:", { userId, google_books_id, title, authors, description, thumbnail, published_date, status, rating, format });
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
            "INSERT INTO user_books (user_id, google_books_id, title, authors, description, thumbnail, published_date, status, rating, format) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [userId, google_books_id, title, authors, description, thumbnail, published_date, status, rating, format]
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

const getBookById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { google_books_id } = req.params;

        const response = await getGoogleBookById(google_books_id);
        if (!response || response.error) {
            return res.status(404).json({
                message: "Book not found in Google Books",
            });
        }
        const data = await response;
        const book = {
            google_books_id: data.id,
            title: data.volumeInfo.title || "Unknown Title",
            authors: data.volumeInfo.authors || [],
            description: data.volumeInfo.description || "",
            thumbnail: data.volumeInfo.imageLinks?.thumbnail || null,
            published_date: data.volumeInfo.publishedDate || "",
        };

        const libraryResult = await db.query("SELECT * FROM user_books WHERE user_id = $1 AND google_books_id = $2", [userId, google_books_id]);
        const libraryEntry = libraryResult.rows[0] || null;

        res.json({ book, libraryEntry });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching book",
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { google_books_id } = req.params;
        const { title, authors, description, thumbnail, published_date, status, rating, format, is_favorite } = req.body;
        await db.query(
            "UPDATE user_books SET title = $1, authors = $2, description = $3, thumbnail = $4, published_date = $5, status = $6, rating = $7, format = $8, is_favorite = $9 WHERE user_id = $10 AND google_books_id = $11",
            [title, authors, description, thumbnail, published_date, status, rating, format, is_favorite, userId, google_books_id]
        );
        res.json({
            message: "Book updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error updating book",
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { google_books_id } = req.params;
        await db.query("DELETE FROM user_books WHERE user_id = $1 AND google_books_id = $2", [userId, google_books_id]);
        res.json({
            message: "Book deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error deleting book",
        });
    }
};

module.exports = { searchBooks, addToLibrary, getBookById, updateBook, deleteBook };