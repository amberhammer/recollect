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
const libraryRoutes = require("../routes/libraryRoutes");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/library", libraryRoutes);
  return app;
};

describe("library routes", () => {
  let app;
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
  });

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("GET /api/library returns all books for the authenticated user", async () => {
    const rows = [{ id: 1, title: "All Book", user_id: 42 }];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/library");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM user_books WHERE user_id = $1",
      [42]
    );
  });

  it("GET /api/library/favorites returns favorite books", async () => {
    const rows = [{ id: 2, title: "Favorite Book", is_favorite: true }];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/library/favorites");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM user_books WHERE user_id = $1 AND is_favorite = true",
      [42]
    );
  });

  it("GET /api/library/currently-reading returns currently reading books", async () => {
    const rows = [{ id: 3, title: "Current Book", status: "currently_reading" }];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/library/currently-reading");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM user_books WHERE user_id = $1 AND status = 'currently_reading'",
      [42]
    );
  });

  it("GET /api/library/to-read returns to-read books", async () => {
    const rows = [{ id: 4, title: "Future Book", status: "to_read" }];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/library/to-read");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM user_books WHERE user_id = $1 AND status = 'to_read'",
      [42]
    );
  });

  it("GET /api/library/loaned-out returns books currently loaned to others", async () => {
    const rows = [{ id: 5, title: "Loaned Book" }];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/library/loaned-out");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM user_books ub WHERE ub.user_id = $1 AND EXISTS (SELECT 1 FROM loans l WHERE l.user_book_id = ub.id AND l.returned_date IS NULL)",
      [42]
    );
  });

  it("GET /api/library/borrowed-books returns currently borrowed books", async () => {
    const rows = [{ id: 6, title: "Borrowed Book", lender_name: "Sam" }];
    db.query.mockResolvedValueOnce({ rows });

    const response = await request(app).get("/api/library/borrowed-books");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT bb.*, c.name AS lender_name FROM borrowed_books bb LEFT JOIN contacts c ON bb.contact_id = c.id WHERE bb.user_id = $1 AND bb.returned_date IS NULL",
      [42]
    );
  });

  it("returns 400 for invalid collections without querying the database", async () => {
    const response = await request(app).get("/api/library/not-real");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid collection" });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("returns 500 when fetching all books fails", async () => {
    db.query.mockRejectedValueOnce(new Error("database unavailable"));

    const response = await request(app).get("/api/library");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error fetching books" });
  });

  it("returns 500 when fetching a collection fails", async () => {
    db.query.mockRejectedValueOnce(new Error("database unavailable"));

    const response = await request(app).get("/api/library/favorites");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error fetching books" });
  });
});
