const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, (req, res) => {
  // JWT logout is handled client-side
  res.json({ message: "Logged out successfully" });
});

module.exports = router;