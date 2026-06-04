const express = require("express");
const router = express.Router();

const { getContacts } = require("../controllers/contactsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getContacts);

module.exports = router;