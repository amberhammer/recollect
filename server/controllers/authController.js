const bcrypt = require('bcrypt');
const db = require("../db");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    const existingEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const existingUsername = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ message: "User with this username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0].id);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    if (err.message.includes("JWT_SECRET")) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.rows[0].id);
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
      },
      message: "Login successful",
    });

  } catch (err) {
    console.error(err);
    if (err.message.includes("JWT_SECRET")) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser };