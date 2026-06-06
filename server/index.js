require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

const libraryRoutes = require('./routes/libraryRoutes');
const authRoutes = require('./routes/authRoutes');
const booksRoutes = require('./routes/booksRoutes');
const loansRoutes = require('./routes/loansRoutes');
const contactsRoutes = require('./routes/contactsRoutes');
const borrowedBooksRoutes = require('./routes/borrowedBooksRoutes');

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());

db.query("SELECT NOW()")
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB connection failed", err));

app.use('/api/library', libraryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/borrowed-books', borrowedBooksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});