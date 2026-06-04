const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query("SELECT id, name FROM contacts WHERE user_id = $1 ORDER BY name", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
};

module.exports = { getContacts };