const db = require("../db");

const createLoan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { user_book_id, google_books_id, contact_id, contact_name, loaned_date } = req.body;

        if ((!user_book_id && !google_books_id) || (!contact_id && !contact_name?.trim()) || !loaned_date) {
            return res.status(400).json({ error: "Book, contact, and loaned date are required" });
        }

        const userBook = await db.query(
            "SELECT id FROM user_books WHERE user_id = $1 AND (id = $2 OR google_books_id = $3)",
            [userId, user_book_id || null, google_books_id || null]
        );
        if (userBook.rows.length === 0) {
            return res.status(404).json({ error: "Book not found in your library" });
        }
        const resolvedUserBookId = userBook.rows[0].id;

        let finalContactId = contact_id;
        if (finalContactId) {
            const contact = await db.query(
                "SELECT id FROM contacts WHERE id = $1 AND user_id = $2",
                [finalContactId, userId]
            );
            if (contact.rows.length === 0) {
                return res.status(400).json({ error: "Contact not found" });
            }
        } else if (contact_name?.trim()) {
            const trimmedContactName = contact_name.trim();
            const existingContact = await db.query("SELECT id FROM contacts WHERE user_id = $1 AND name = $2", [userId, trimmedContactName]);
            if (existingContact.rows.length > 0) {
                finalContactId = existingContact.rows[0].id;
            } else {
                const newContact = await db.query("INSERT INTO contacts (user_id, name) VALUES ($1, $2) RETURNING id", [userId, trimmedContactName]);
                finalContactId = newContact.rows[0].id;
            }
        }

        const existingLoan = await db.query("SELECT * FROM loans WHERE user_book_id = $1 AND returned_date IS NULL", [resolvedUserBookId]);
        if (existingLoan.rows.length > 0) {
            return res.status(400).json({ error: "Book is already loaned out" });
        }

        const loan = await db.query(
            "INSERT INTO loans (user_book_id, contact_id, loaned_date) VALUES ($1, $2, $3) RETURNING *",
            [resolvedUserBookId, finalContactId, loaned_date]
        );

        const createdLoan = await db.query(
            "SELECT l.*, c.name AS contact_name FROM loans l JOIN contacts c ON l.contact_id = c.id JOIN user_books ub ON l.user_book_id = ub.id WHERE l.id = $1 AND ub.user_id = $2",
            [loan.rows[0].id, userId]
        );

        res.status(201).json(createdLoan.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create loan" });
    }
};

const returnLoan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { loanId } = req.params;

        const loan = await db.query(
            "UPDATE loans l SET returned_date = CURRENT_DATE FROM user_books ub WHERE l.id = $1 AND l.user_book_id = ub.id AND ub.user_id = $2 RETURNING l.*",
            [loanId, userId]
        );
        if (loan.rows.length === 0) {
            return res.status(404).json({ error: "Loan not found" });
        }

        const updatedLoan = await db.query(
            "SELECT l.*, c.name AS contact_name FROM loans l JOIN contacts c ON l.contact_id = c.id JOIN user_books ub ON l.user_book_id = ub.id WHERE l.id = $1 AND ub.user_id = $2",
            [loan.rows[0].id, userId]
        );

        res.json(updatedLoan.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to return loan" });
    }
};

const getLoanHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userBookId } = req.params;
        const loans = await db.query(
            "SELECT l.*, c.name AS contact_name FROM loans l JOIN contacts c ON l.contact_id = c.id JOIN user_books ub ON l.user_book_id = ub.id WHERE l.user_book_id = $1 AND ub.user_id = $2 ORDER BY l.loaned_date DESC",
            [userBookId, userId]
        );
        res.json(loans.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch loan history" });
    }
};

module.exports = { createLoan, returnLoan, getLoanHistory };
