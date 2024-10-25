// __tests__/userController.test.js
const request = require("supertest");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const {
  createUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

// Mock Prisma
jest.mock("@prisma/client");
jest.mock("../database/dbConnection", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("User Controller Tests", () => {
  let app;
  const prisma = require("../database/dbConnection");

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create Express app for testing
    app = express();
    app.use(express.json());
    app.use(cookieParser());

    // Setup routes for testing
    app.post("/api/users/adduser", createUser);
    app.post("/api/users/login", loginUser);
    app.post("/api/users/logout", logoutUser);
  });

  describe("createUser", () => {
    const mockUser = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    test("should successfully create a new user", async () => {
      const hashedPassword = "hashedPassword123";
      const createdUser = { ...mockUser, id: 1, password: hashedPassword };

      // Mock the dependencies
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      prisma.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post("/api/users/adduser")
        .send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
    });

    test("should return 400 if user already exists", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/users/adduser")
        .send(mockUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("User already exists");
    });

    test("should return 500 if server error occurs", async () => {
      prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/api/users/adduser")
        .send(mockUser);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");
    });
  });

  describe("loginUser", () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword123",
    };

    const loginCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    test("should successfully login user", async () => {
      const mockToken = "mock-jwt-token";

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const response = await request(app)
        .post("/api/users/login")
        .send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBe(mockToken);
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    test("should return 401 for invalid email", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/users/login")
        .send(loginCredentials);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid credentials");
    });

    test("should return 401 for invalid password", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post("/api/users/login")
        .send(loginCredentials);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid credentials");
    });
  });

  describe("logoutUser", () => {
    test("should successfully logout user", async () => {
      const response = await request(app).post("/api/users/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out successfully");

      // Verify that the cookie is cleared
      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/accessToken=;/);
    });
  });
});
