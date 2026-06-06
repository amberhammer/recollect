const express = require("express");
const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

jest.mock("../middleware/authMiddleware", () => (req, res, next) => {
  req.user = { id: 42 };
  next();
});

const db = require("../db");
const loansRoutes = require("../routes/loansRoutes");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/loans", loansRoutes);
  return app;
};

describe("loans routes", () => {
  let app;
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("GET /api/loans/book/:userBookId returns loan history", async () => {
    const rows = [
      { id: 1, user_book_id: 10, contact_name: "Sam", loaned_date: "2026-01-01", returned_date: null },
    ];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/loans/book/10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT l.*, c.name AS contact_name FROM loans l JOIN contacts c ON l.contact_id = c.id JOIN user_books ub ON l.user_book_id = ub.id WHERE l.user_book_id = $1 AND ub.user_id = $2 ORDER BY l.loaned_date DESC",
      ["10", 42]
    );
  });

  it("POST /api/loans creates a loan with an existing contact id", async () => {
    const insertedLoan = { id: 20, user_book_id: 10, contact_id: 5, loaned_date: "2026-01-01" };
    const createdLoan = { ...insertedLoan, contact_name: "Sam", returned_date: null };

    db.query
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockResolvedValueOnce({ rows: [{ id: 5 }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [insertedLoan] })
      .mockResolvedValueOnce({ rows: [createdLoan] });

    const response = await request(app).post("/api/loans").send({
      user_book_id: 10,
      contact_id: 5,
      loaned_date: "2026-01-01",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdLoan);
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT id FROM user_books WHERE id = $1 AND user_id = $2",
      [10, 42]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "SELECT id FROM contacts WHERE id = $1 AND user_id = $2",
      [5, 42]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      3,
      "SELECT * FROM loans WHERE user_book_id = $1 AND returned_date IS NULL",
      [10]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      4,
      "INSERT INTO loans (user_book_id, contact_id, loaned_date) VALUES ($1, $2, $3) RETURNING *",
      [10, 5, "2026-01-01"]
    );
  });

  it("POST /api/loans creates a contact when contact_name is new", async () => {
    const newContact = { id: 8 };
    const insertedLoan = { id: 21, user_book_id: 10, contact_id: 8, loaned_date: "2026-01-02" };
    const createdLoan = { ...insertedLoan, contact_name: "New Person", returned_date: null };

    db.query
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [newContact] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [insertedLoan] })
      .mockResolvedValueOnce({ rows: [createdLoan] });

    const response = await request(app).post("/api/loans").send({
      user_book_id: 10,
      contact_name: "New Person",
      loaned_date: "2026-01-02",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdLoan);
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT id FROM user_books WHERE id = $1 AND user_id = $2",
      [10, 42]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "SELECT id FROM contacts WHERE user_id = $1 AND name = $2",
      [42, "New Person"]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      3,
      "INSERT INTO contacts (user_id, name) VALUES ($1, $2) RETURNING id",
      [42, "New Person"]
    );
  });

  it("POST /api/loans reuses an existing contact found by name", async () => {
    const existingContact = { id: 9 };
    const insertedLoan = { id: 22, user_book_id: 10, contact_id: 9, loaned_date: "2026-01-03" };
    const createdLoan = { ...insertedLoan, contact_name: "Known Person", returned_date: null };

    db.query
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockResolvedValueOnce({ rows: [existingContact] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [insertedLoan] })
      .mockResolvedValueOnce({ rows: [createdLoan] });

    const response = await request(app).post("/api/loans").send({
      user_book_id: 10,
      contact_name: "Known Person",
      loaned_date: "2026-01-03",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdLoan);
    expect(db.query).not.toHaveBeenCalledWith(
      "INSERT INTO contacts (user_id, name) VALUES ($1, $2) RETURNING id",
      expect.any(Array)
    );
  });

  it("POST /api/loans returns 400 when contact or loaned date is missing", async () => {
    const response = await request(app).post("/api/loans").send({
      user_book_id: 10,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Book, contact, and loaned date are required" });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("POST /api/loans returns 400 when the book already has an active loan", async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockResolvedValueOnce({ rows: [{ id: 5 }] })
      .mockResolvedValueOnce({
        rows: [{ id: 30, user_book_id: 10, returned_date: null }],
      });

    const response = await request(app).post("/api/loans").send({
      user_book_id: 10,
      contact_id: 5,
      loaned_date: "2026-01-01",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Book is already loaned out" });
    expect(db.query).toHaveBeenCalledTimes(3);
  });

  it("POST /api/loans returns 404 when the book is not owned by the user", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).post("/api/loans").send({
      user_book_id: 999,
      contact_id: 5,
      loaned_date: "2026-01-01",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Book not found in your library" });
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id FROM user_books WHERE id = $1 AND user_id = $2",
      [999, 42]
    );
  });

  it("POST /api/loans returns 400 when the contact is not owned by the user", async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockResolvedValueOnce({ rows: [] });

    const response = await request(app).post("/api/loans").send({
      user_book_id: 10,
      contact_id: 999,
      loaned_date: "2026-01-01",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Contact not found" });
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "SELECT id FROM contacts WHERE id = $1 AND user_id = $2",
      [999, 42]
    );
  });

  it("PATCH /api/loans/:loanId/return marks a loan as returned", async () => {
    const returnedLoan = { id: 20, returned_date: "2026-06-05" };
    const joinedLoan = { ...returnedLoan, contact_name: "Sam" };

    db.query
      .mockResolvedValueOnce({ rows: [returnedLoan] })
      .mockResolvedValueOnce({ rows: [joinedLoan] });

    const response = await request(app).patch("/api/loans/20/return");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(joinedLoan);
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "UPDATE loans l SET returned_date = CURRENT_DATE FROM user_books ub WHERE l.id = $1 AND l.user_book_id = ub.id AND ub.user_id = $2 RETURNING l.*",
      ["20", 42]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "SELECT l.*, c.name AS contact_name FROM loans l JOIN contacts c ON l.contact_id = c.id JOIN user_books ub ON l.user_book_id = ub.id WHERE l.id = $1 AND ub.user_id = $2",
      [20, 42]
    );
  });

  it("PATCH /api/loans/:loanId/return returns 404 when the loan is not owned by the user", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).patch("/api/loans/999/return");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Loan not found" });
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE loans l SET returned_date = CURRENT_DATE FROM user_books ub WHERE l.id = $1 AND l.user_book_id = ub.id AND ub.user_id = $2 RETURNING l.*",
      ["999", 42]
    );
  });

  it("returns 500 when fetching loan history fails", async () => {
    db.query.mockRejectedValueOnce(new Error("database unavailable"));

    const response = await request(app).get("/api/loans/book/10");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to fetch loan history" });
  });
});
