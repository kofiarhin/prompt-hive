const request = require("supertest");
const app = require("../app");

async function createUser(overrides = {}) {
  const defaults = {
    name: "Test User",
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: "password123",
  };
  const data = { ...defaults, ...overrides };
  const res = await request(app).post("/api/auth/register").send(data);
  const cookies = res.headers["set-cookie"];
  return { user: res.body.data.user, cookies, data };
}

async function createAdmin() {
  const User = require("../models/User");
  const { user, cookies } = await createUser({
    username: `admin${Date.now()}`,
    email: `admin${Date.now()}@example.com`,
  });
  await User.findByIdAndUpdate(user._id, { role: "admin" });
  // Re-login to get fresh token with updated role
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: "password123" });
  return { user: res.body.data.user, cookies: res.headers["set-cookie"] };
}

async function createTestContent(cookies, overrides = {}) {
  const defaults = {
    title: `Test Content ${Date.now()}`,
    description: "Test description",
    type: "prompt",
    contentText: "This is test prompt text",
    category: "coding",
    tags: ["beginner"],
    visibility: "public",
  };
  const data = { ...defaults, ...overrides };
  const res = await request(app)
    .post("/api/content")
    .set("Cookie", cookies)
    .send(data);
  return res.body.data.content;
}

module.exports = { createUser, createAdmin, createTestContent };
