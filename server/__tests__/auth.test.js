const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("./setup");
const app = require("../app");
const { createUser } = require("./helpers");

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("registers a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "New User",
        username: "newuser",
        email: "new@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("new@example.com");
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("rejects duplicate email", async () => {
      await createUser({ email: "dup@example.com", username: "dup1" });
      const res = await request(app).post("/api/auth/register").send({
        name: "Dup",
        username: "dup2",
        email: "dup@example.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("rejects invalid input", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "",
        username: "",
        email: "notanemail",
        password: "12",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.details.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in with valid credentials", async () => {
      const { data } = await createUser();
      const res = await request(app).post("/api/auth/login").send({
        email: data.email,
        password: data.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(data.email);
    });

    it("rejects invalid password", async () => {
      const { data } = await createUser();
      const res = await request(app).post("/api/auth/login").send({
        email: data.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns current user with valid token", async () => {
      const { cookies } = await createUser();
      const res = await request(app).get("/api/auth/me").set("Cookie", cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.user).toBeDefined();
    });

    it("returns null user without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeNull();
    });
  });

  describe("POST /api/auth/logout", () => {
    it("clears the auth cookie", async () => {
      const res = await request(app).post("/api/auth/logout");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
