const express = require("express");
const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../utils/generateToken", () => jest.fn());

jest.mock("../middleware/authMiddleware", () => (req, res, next) => {
  req.user = { id: 42 };
  next();
});

const bcrypt = require("bcrypt");
const db = require("../db");
const generateToken = require("../utils/generateToken");
const authRoutes = require("../routes/authRoutes");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  return app;
};

describe("auth routes", () => {
  let app;
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
    generateToken.mockReturnValue("test-token");
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("POST /api/auth/register creates a user and returns a token", async () => {
    bcrypt.hash.mockResolvedValueOnce("hashed-password");
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: 42, username: "amber", email: "amber@example.com" }],
      });

    const response = await request(app).post("/api/auth/register").send({
      username: "amber",
      email: "amber@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User registered successfully",
      token: "test-token",
    });
    expect(db.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE email = $1",
      ["amber@example.com"]
    );
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM users WHERE username = $1",
      ["amber"]
    );
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(generateToken).toHaveBeenCalledWith(42);
  });

  it("POST /api/auth/register returns 400 when required fields are missing", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "amber",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Username, email, and password are required",
    });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("POST /api/auth/register validates password length, email, and username", async () => {
    const shortPassword = await request(app).post("/api/auth/register").send({
      username: "amber",
      email: "amber@example.com",
      password: "short",
    });
    expect(shortPassword.status).toBe(400);
    expect(shortPassword.body).toEqual({ message: "Password must be at least 8 characters long" });

    const invalidEmail = await request(app).post("/api/auth/register").send({
      username: "amber",
      email: "not-an-email",
      password: "password123",
    });
    expect(invalidEmail.status).toBe(400);
    expect(invalidEmail.body).toEqual({ message: "Invalid email format" });

    const shortUsername = await request(app).post("/api/auth/register").send({
      username: "ab",
      email: "amber@example.com",
      password: "password123",
    });
    expect(shortUsername.status).toBe(400);
    expect(shortUsername.body).toEqual({ message: "Username must be at least 3 characters long" });
  });

  it("POST /api/auth/register rejects duplicate email", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: "amber@example.com" }],
    });

    const response = await request(app).post("/api/auth/register").send({
      username: "amber",
      email: "amber@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "User with this email already exists" });
  });

  it("POST /api/auth/register rejects duplicate username", async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 1, username: "amber" }] });

    const response = await request(app).post("/api/auth/register").send({
      username: "amber",
      email: "amber@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "User with this username already exists" });
  });

  it("POST /api/auth/login returns a token and user for valid credentials", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 42,
        username: "amber",
        email: "amber@example.com",
        password_hash: "hashed-password",
      }],
    });
    bcrypt.compare.mockResolvedValueOnce(true);

    const response = await request(app).post("/api/auth/login").send({
      email: "amber@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: "test-token",
      user: {
        id: 42,
        username: "amber",
        email: "amber@example.com",
      },
      message: "Login successful",
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed-password");
    expect(generateToken).toHaveBeenCalledWith(42);
  });

  it("POST /api/auth/login validates required fields", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "amber@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Email and password are required" });
    expect(db.query).not.toHaveBeenCalled();
  });

  it("POST /api/auth/login rejects unknown email", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).post("/api/auth/login").send({
      email: "missing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email or password" });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("POST /api/auth/login rejects invalid password", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 42, email: "amber@example.com", password_hash: "hashed-password" }],
    });
    bcrypt.compare.mockResolvedValueOnce(false);

    const response = await request(app).post("/api/auth/login").send({
      email: "amber@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email or password" });
  });

  it("GET /api/auth/me returns the authenticated user", async () => {
    const user = { id: 42, username: "amber", email: "amber@example.com" };
    db.query.mockResolvedValueOnce({ rows: [user] });

    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user });
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, username, email FROM users WHERE id = $1",
      [42]
    );
  });

  it("GET /api/auth/me returns 404 when the user is missing", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("POST /api/auth/logout returns a success message", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logged out successfully" });
  });
});
