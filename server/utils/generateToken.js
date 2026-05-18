const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in environment variables");
  }

  try {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error("Token has expired" );
    }
    if (err.name === 'JsonWebTokenError') {
      throw new Error("Invalid token" );
    }
    throw new Error("Server error" );
  }
};

module.exports = generateToken;