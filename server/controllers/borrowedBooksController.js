require("dotenv").config();
const db = require("../db");

const createBorrowedBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { google_books_id, title, author, thumbnail, published_date, rating, contact_id, contact_name, borrowed_date, status, is_favorite } = req.body;

        let finalContactId = contact_id;
        if (!finalContactId && contact_name) {
            const existingContact = await db.query("SELECT id FROM contacts WHERE user_id = $1 AND name = $2", [userId, contact_name]);
            if (existingContact.rows.length > 0) {
                finalContactId = existingContact.rows[0].id;
            } else {
                const newContact = await db.query("INSERT INTO contacts (user_id, name) VALUES ($1, $2) RETURNING id", [userId, contact_name]);
                finalContactId = newContact.rows[0].id;
            }
        }

        if (!google_books_id || !title || !finalContactId || !borrowed_date) {
            return res.status(400).json({
                message: "Required fields are missing",
            });
        }
        const result = await db.query(
            "INSERT INTO borrowed_books (user_id, google_books_id, title, author, thumbnail, published_date, rating, contact_id, borrowed_date, status, is_favorite) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [userId, google_books_id, title, author, thumbnail, published_date, rating, finalContactId, borrowed_date, status || "borrowed", is_favorite || false]
        );

        const createdBorrowedBook = await db.query(
            "SELECT bb.*, c.name AS lender_name, c.name AS contact_name FROM borrowed_books bb JOIN contacts c ON bb.contact_id = c.id WHERE bb.id = $1",
            [result.rows[0].id]
        );

        res.status(201).json(createdBorrowedBook.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error creating borrowed book",
        });
    }
};

const getBorrowedBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            "SELECT bb.*, c.name AS contact_name FROM borrowed_books bb JOIN contacts c ON bb.contact_id = c.id WHERE bb.user_id = $1 ORDER BY borrowed_date DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching borrowed books",
        });
    }
};

const getBorrowedBookById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await db.query(
            "SELECT bb.*, c.name AS contact_name FROM borrowed_books bb JOIN contacts c ON bb.contact_id = c.id WHERE bb.user_id = $1 AND bb.id = $2",
            [userId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Borrowed book not found",
            });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching borrowed book",
        });
    }
};

const updateBorrowedBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { rating, contact_id, contact_name, borrowed_date, status, is_favorite } = req.body;

        let finalContactId = contact_id;
        if (!finalContactId && contact_name) {
            const existingContact = await db.query("SELECT id FROM contacts WHERE user_id = $1 AND name = $2", [userId, contact_name]);
            if (existingContact.rows.length > 0) {
                finalContactId = existingContact.rows[0].id;
            } else {
                const newContact = await db.query("INSERT INTO contacts (user_id, name) VALUES ($1, $2) RETURNING id", [userId, contact_name]);
                finalContactId = newContact.rows[0].id;
            }
        }

        const result = await db.query(
            "UPDATE borrowed_books SET rating = $1, contact_id = COALESCE($2, contact_id), borrowed_date = $3, status = $4, is_favorite = $5 WHERE user_id = $6 AND id = $7 RETURNING *",
            [rating, finalContactId, borrowed_date, status, is_favorite, userId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Borrowed book not found",
            });
        }

        const updatedBorrowedBook = await db.query(
            "SELECT bb.*, c.name AS lender_name, c.name AS contact_name FROM borrowed_books bb JOIN contacts c ON bb.contact_id = c.id WHERE bb.id = $1",
            [result.rows[0].id]
        );

        res.json(updatedBorrowedBook.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error updating borrowed book",
        });
    }
};

const returnBorrowedBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await db.query(
            "UPDATE borrowed_books SET returned_date = CURRENT_DATE WHERE user_id = $1 AND id = $2 RETURNING *",
            [userId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Borrowed book not found",
            });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error returning borrowed book",
        });
    }
};

const deleteBorrowedBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await db.query(
            "DELETE FROM borrowed_books WHERE user_id = $1 AND id = $2 RETURNING *",
            [userId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Borrowed book not found",
            });
        }
        res.json({
            message: "Borrowed book deleted",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error deleting borrowed book",
        });
    }
};

module.exports = { createBorrowedBook, getBorrowedBooks, getBorrowedBookById, updateBorrowedBook, returnBorrowedBook, deleteBorrowedBook };
