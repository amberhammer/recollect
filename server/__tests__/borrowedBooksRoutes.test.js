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
const borrowedBooksRoutes = require("../routes/borrowedBooksRoutes");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/borrowed-books", borrowedBooksRoutes);
  return app;
};

describe("borrowed books routes", () => {
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

  it("POST /api/borrowed-books creates a borrowed book with an existing contact id", async () => {
    const insertedBook = { id: 10, title: "Borrowed Book", contact_id: 5 };
    const createdBook = { ...insertedBook, contact_name: "Sam", lender_name: "Sam" };

    db.query
      .mockResolvedValueOnce({ rows: [insertedBook] })
      .mockResolvedValueOnce({ rows: [createdBook] });

    const payload = {
      google_books_id: "google-1",
      title: "Borrowed Book",
      author: "A. Writer",
      thumbnail: "https://example.com/cover.jpg",
      published_date: "2024",
      rating: null,
      contact_id: 5,
      borrowed_date: "2026-06-05",
      status: "borrowed",
      is_favorite: false,
    };

    const response = await request(app).post("/api/borrowed-books").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdBook);
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO borrowed_books (user_id, google_books_id, title, author, thumbnail, published_date, rating, contact_id, borrowed_date, status, is_favorite) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [42, "google-1", "Borrowed Book", "A. Writer", "https://example.com/cover.jpg", "2024", null, 5, "2026-06-05", "borrowed", false]
    );
  });

  it("POST /api/borrowed-books creates a new contact when contact_name is new", async () => {
    const insertedBook = { id: 11, title: "Borrowed Book", contact_id: 8 };
    const createdBook = { ...insertedBook, contact_name: "New Lender", lender_name: "New Lender" };

    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 8 }] })
      .mockResolvedValueOnce({ rows: [insertedBook] })
      .mockResolvedValueOnce({ rows: [createdBook] });

    const response = await request(app).post("/api/borrowed-books").send({
      google_books_id: "google-2",
      title: "Borrowed Book",
      author: "A. Writer",
      contact_name: "New Lender",
      borrowed_date: "2026-06-05",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdBook);
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT id FROM contacts WHERE user_id = $1 AND name = $2",
      [42, "New Lender"]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO contacts (user_id, name) VALUES ($1, $2) RETURNING id",
      [42, "New Lender"]
    );
  });

  it("POST /api/borrowed-books returns 400 when required fields are missing", async () => {
    const response = await request(app).post("/api/borrowed-books").send({
      google_books_id: "google-1",
      title: "Borrowed Book",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Required fields are missing" });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("GET /api/borrowed-books returns borrowed books for the authenticated user", async () => {
    const rows = [{ id: 10, title: "Borrowed Book", contact_name: "Sam" }];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/borrowed-books");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT bb.*, c.name AS contact_name FROM borrowed_books bb JOIN contacts c ON bb.contact_id = c.id WHERE bb.user_id = $1 ORDER BY borrowed_date DESC",
      [42]
    );
  });

  it("GET /api/borrowed-books/:id returns a borrowed book by id", async () => {
    const foundBook = { id: 10, title: "Borrowed Book" };
    const joinedBook = { ...foundBook, contact_name: "Sam", lender_name: "Sam" };

    db.query
      .mockResolvedValueOnce({ rows: [foundBook] })
      .mockResolvedValueOnce({ rows: [joinedBook] });

    const response = await request(app).get("/api/borrowed-books/10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(joinedBook);
  });

  it("GET /api/borrowed-books/:id returns 404 when the book is not found", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get("/api/borrowed-books/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Borrowed book not found" });
  });

  it("PATCH /api/borrowed-books/:id updates a borrowed book", async () => {
    const updatedBook = { id: 10, title: "Borrowed Book", rating: 4, contact_id: 5 };
    const joinedBook = { ...updatedBook, contact_name: "Sam", lender_name: "Sam" };

    db.query
      .mockResolvedValueOnce({ rows: [updatedBook] })
      .mockResolvedValueOnce({ rows: [joinedBook] });

    const response = await request(app).patch("/api/borrowed-books/10").send({
      rating: 4,
      contact_id: 5,
      borrowed_date: "2026-06-05",
      status: "currently_reading",
      is_favorite: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(joinedBook);
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "UPDATE borrowed_books SET rating = $1, contact_id = COALESCE($2, contact_id), borrowed_date = $3, status = $4, is_favorite = $5 WHERE user_id = $6 AND id = $7 RETURNING *",
      [4, 5, "2026-06-05", "currently_reading", true, 42, "10"]
    );
  });

  it("PATCH /api/borrowed-books/:id returns 404 when updating a missing borrowed book", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).patch("/api/borrowed-books/999").send({
      rating: 4,
      contact_id: 5,
      borrowed_date: "2026-06-05",
      status: "borrowed",
      is_favorite: false,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Borrowed book not found" });
  });

  it("PATCH /api/borrowed-books/:id/return marks a borrowed book as returned", async () => {
    const returnedBook = { id: 10, title: "Borrowed Book", returned_date: "2026-06-05" };
    db.query.mockResolvedValueOnce({ rows: [returnedBook] });

    const response = await request(app).patch("/api/borrowed-books/10/return");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(returnedBook);
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE borrowed_books SET returned_date = CURRENT_DATE WHERE user_id = $1 AND id = $2 RETURNING *",
      [42, "10"]
    );
  });

  it("DELETE /api/borrowed-books/:id deletes a borrowed book", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 10 }] });

    const response = await request(app).delete("/api/borrowed-books/10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Borrowed book deleted" });
    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM borrowed_books WHERE user_id = $1 AND id = $2 RETURNING *",
      [42, "10"]
    );
  });
});
