require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

const libraryRoutes = require('./routes/libraryRoutes');

app.use(cors());
app.use(express.json());

db.query("SELECT NOW()")
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB connection failed", err));

// app.get("/test-db", async (req, res) => {
//   const result = await require("./db").query("SELECT NOW()");
//   res.json(result.rows);
// });

app.use('/api/library', libraryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});