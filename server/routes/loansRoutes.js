const express = require("express");
const router = express.Router();

const { getLoanHistory, createLoan, returnLoan } = require("../controllers/loansController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/book/:userBookId", authMiddleware, getLoanHistory);
router.post("/", authMiddleware, createLoan);
router.patch("/:loanId/return", authMiddleware, returnLoan);

module.exports = router;