export const createLoan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { user_book_id, contact_id, contact_name, loaned_date } = req.body;

        let finalContactId = contact_id;
        if (!finalContactId) {
            const existingContact = await db.query("SELECT id FROM contacts WHERE user_id = $1 AND name = $2", [userId, contact_name]);
            if (existingContact.rows.length > 0) {
                finalContactId = existingContact.rows[0].id;
            }
        } else {
            const newContact = await db.query("INSERT INTO contacts (user_id, name) VALUES ($1, $2) RETURNING id", [userId, contact_name]);
            finalContactId = newContact.rows[0].id;
        }

        const existingLoan = await db.query("SELECT * FROM loans WHERE user_book_id = $1 AND returned_date IS NULL", [user_book_id]);
        if (existingLoan.rows.length > 0) {
            return res.status(400).json({ error: "Book is already loaned out" });
        }

        const loan = await db.query(
            "INSERT INTO loans (user_book_id, contact_id, loaned_date) VALUES ($1, $2, $3) RETURNING *",
            [user_book_id, finalContactId, loaned_date]
        );
        res.status(201).json(loan.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create loan" });
    }
};

export const returnLoan = async (req, res) => {
    try {
        const { loanId } = req.params;

        const loan = await db.query(
            "UPDATE loans SET returned_date = CURRENT_Date WHERE id = $1 RETURNING *",
            [loanId]
        );
        res.json(loan.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to return loan" });
    }
};

export const getLoanHistory = async (req, res) => {
    try {
        const { userBookId } = req.params;
        const loans = await db.query(
            "SELECT l.*, c.name FROM loans l JOIN contacts c ON l.contact_id = c.id WHERE l.user_book_id = $1 ORDER BY l.loaned_date DESC",
            [userBookId]
        );
        res.json(loans.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch loan history" });
    }
};