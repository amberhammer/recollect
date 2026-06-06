const express = require("express");
const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

jest.mock("../middleware/authMiddleware", () => (req, res, next) => {
  req.user = { id: 42 };
  next();
});

jest.mock("../services/googleBooksService", () => ({
  getGoogleBookById: jest.fn(),
}));

const db = require("../db");
const { getGoogleBookById } = require("../services/googleBooksService");
const booksRoutes = require("../routes/booksRoutes");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/books", booksRoutes);
  return app;
};

describe("books routes", () => {
  let app;
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => { });
  });

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    delete global.fetch;
  });

  it("GET /api/books/search returns 400 when q is missing", async () => {
    const response = await request(app).get("/api/books/search");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Search query is required" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("GET /api/books/search returns normalized Google Books results", async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        items: [
          {
            id: "google-1",
            volumeInfo: {
              title: "Found Book",
              authors: ["A. Writer"],
              description: "A result.",
              imageLinks: { thumbnail: "https://example.com/cover.jpg" },
              publishedDate: "2024",
            },
          },
        ],
      }),
    });

    const response = await request(app).get("/api/books/search?q=found");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        google_books_id: "google-1",
        title: "Found Book",
        authors: ["A. Writer"],
        description: "A result.",
        thumbnail: "https://example.com/cover.jpg",
        published_date: "2024",
      },
    ]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=found")
    );
  });

  it("POST /api/books adds a book to the authenticated user's library", async () => {
    const addedBook = {
      id: 1,
      user_id: 42,
      google_books_id: "google-1",
      title: "New Book",
      authors: ["A. Writer"],
      description: "Fresh.",
      thumbnail: "https://example.com/cover.jpg",
      published_date: "2024",
      status: "to_read",
      rating: null,
      format: "physical",
    };

    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [addedBook] });

    const payload = {
      google_books_id: "google-1",
      title: "New Book",
      authors: ["A. Writer"],
      description: "Fresh.",
      thumbnail: "https://example.com/cover.jpg",
      published_date: "2024",
      status: "to_read",
      rating: null,
      format: "physical",
    };

    const response = await request(app).post("/api/books").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(addedBook);
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM user_books WHERE user_id = $1 AND google_books_id = $2",
      [42, "google-1"]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO user_books (user_id, google_books_id, title, authors, description, thumbnail, published_date, status, rating, format) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [42, "google-1", "New Book", ["A. Writer"], "Fresh.", "https://example.com/cover.jpg", "2024", "to_read", null, "physical"]
    );
  });

  it("POST /api/books prevents duplicate library books", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, google_books_id: "google-1" }] });

    const response = await request(app).post("/api/books").send({
      google_books_id: "google-1",
      title: "Existing Book",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Book already in library" });
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it("POST /api/books returns 400 when required fields are missing", async () => {
    const response = await request(app).post("/api/books").send({
      google_books_id: "google-1",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Required fields are missing" });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("GET /api/books/:google_books_id returns book detail, library entry, current loan, and loan history", async () => {
    getGoogleBookById.mockResolvedValueOnce({
      id: "google-1",
      volumeInfo: {
        title: "Detail Book",
        authors: ["A. Writer"],
        description: "Details.",
        imageLinks: { thumbnail: "https://example.com/cover.jpg" },
        publishedDate: "2024",
      },
    });

    const libraryEntry = { id: 10, google_books_id: "google-1", title: "Detail Book" };
    const loanHistory = [
      { id: 100, contact_name: "Sam", loaned_date: "2026-01-01", returned_date: null },
      { id: 101, contact_name: "Lee", loaned_date: "2025-01-01", returned_date: "2025-02-01" },
    ];

    db.query
      .mockResolvedValueOnce({ rows: [libraryEntry] })
      .mockResolvedValueOnce({ rows: loanHistory });

    const response = await request(app).get("/api/books/google-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      book: {
        google_books_id: "google-1",
        title: "Detail Book",
        authors: ["A. Writer"],
        description: "Details.",
        thumbnail: "https://example.com/cover.jpg",
        published_date: "2024",
      },
      libraryEntry,
      currentLoan: loanHistory[0],
      loanHistory,
    });
  });

  it("GET /api/books/:google_books_id returns 404 when Google Books has no result", async () => {
    getGoogleBookById.mockResolvedValueOnce({ error: { message: "Not found" } });

    const response = await request(app).get("/api/books/missing-book");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Book not found in Google Books" });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("PUT /api/books/:google_books_id updates a library book", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const payload = {
      title: "Updated Book",
      authors: ["A. Writer"],
      description: "Updated.",
      thumbnail: "https://example.com/updated.jpg",
      published_date: "2025",
      status: "read",
      rating: 5,
      format: "ebook",
      is_favorite: true,
    };

    const response = await request(app).put("/api/books/google-1").send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Book updated successfully" });
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE user_books SET title = $1, authors = $2, description = $3, thumbnail = $4, published_date = $5, status = $6, rating = $7, format = $8, is_favorite = $9 WHERE user_id = $10 AND google_books_id = $11",
      ["Updated Book", ["A. Writer"], "Updated.", "https://example.com/updated.jpg", "2025", "read", 5, "ebook", true, 42, "google-1"]
    );
  });

  it("DELETE /api/books/:google_books_id deletes a library book", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).delete("/api/books/google-1");

    expect(response.status).toBe(204);
    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM user_books WHERE user_id = $1 AND google_books_id = $2",
      [42, "google-1"]
    );
  });
});
