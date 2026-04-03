const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("./setup");
const app = require("../app");
const { createUser, createAdmin, createTestContent } = require("./helpers");

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("Content API", () => {
  describe("POST /api/content", () => {
    it("creates content for authenticated user", async () => {
      const { cookies } = await createUser();
      const res = await request(app)
        .post("/api/content")
        .set("Cookie", cookies)
        .send({
          title: "Test Prompt",
          description: "A test prompt",
          type: "prompt",
          contentText: "Do something useful",
          category: "coding",
          visibility: "public",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.content.slug).toBeDefined();
      expect(res.body.data.content.ownerType).toBe("user");
    });

    it("rejects unauthenticated create", async () => {
      const res = await request(app).post("/api/content").send({
        title: "Test",
        description: "Test",
        type: "prompt",
        contentText: "Text",
        category: "coding",
      });

      expect(res.status).toBe(401);
    });

    it("requires skill provider for skill type", async () => {
      const { cookies } = await createUser();
      const res = await request(app)
        .post("/api/content")
        .set("Cookie", cookies)
        .send({
          title: "Test Skill",
          description: "A test skill",
          type: "skill",
          contentText: "Skill content",
          category: "coding",
        });

      expect(res.status).toBe(400);
    });

    it("generates collision-safe slugs", async () => {
      const { cookies } = await createUser();
      const base = { description: "Desc", type: "prompt", contentText: "Text", category: "coding", visibility: "public" };

      const res1 = await request(app).post("/api/content").set("Cookie", cookies).send({ ...base, title: "Same Title" });
      const res2 = await request(app).post("/api/content").set("Cookie", cookies).send({ ...base, title: "Same Title" });

      expect(res1.body.data.content.slug).not.toBe(res2.body.data.content.slug);
    });
  });

  describe("GET /api/content", () => {
    it("returns only public non-deleted content", async () => {
      const { cookies } = await createUser();
      await createTestContent(cookies, { visibility: "public", title: "Public One" });
      await createTestContent(cookies, { visibility: "private", title: "Private One" });

      const res = await request(app).get("/api/content");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Public One");
      expect(res.body.meta).toBeDefined();
    });

    it("supports filtering by type", async () => {
      const { cookies } = await createUser();
      await createTestContent(cookies, { type: "prompt", title: "Prompt" });
      await createTestContent(cookies, { type: "skill", skillProvider: "claude", title: "Skill" });

      const res = await request(app).get("/api/content?type=skill");
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].type).toBe("skill");
    });
  });

  describe("GET /api/content/:slug", () => {
    it("returns public content to anyone", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies, { visibility: "public" });

      const res = await request(app).get(`/api/content/${content.slug}`);
      expect(res.status).toBe(200);
    });

    it("returns 404 for private content to unauthorized user", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies, { visibility: "private" });

      const { cookies: otherCookies } = await createUser({ username: "other", email: "other@test.com" });
      const res = await request(app).get(`/api/content/${content.slug}`).set("Cookie", otherCookies);

      expect(res.status).toBe(404);
    });

    it("returns private content to owner", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies, { visibility: "private" });

      const res = await request(app).get(`/api/content/${content.slug}`).set("Cookie", cookies);
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/content/:id", () => {
    it("allows owner to update", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      const res = await request(app)
        .put(`/api/content/${content._id}`)
        .set("Cookie", cookies)
        .send({ title: "Updated Title" });

      expect(res.status).toBe(200);
      expect(res.body.data.content.title).toBe("Updated Title");
    });

    it("blocks non-owner from updating", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      const { cookies: otherCookies } = await createUser({ username: "other2", email: "other2@test.com" });
      const res = await request(app)
        .put(`/api/content/${content._id}`)
        .set("Cookie", otherCookies)
        .send({ title: "Hacked" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/content/:id", () => {
    it("soft deletes content", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      const res = await request(app).delete(`/api/content/${content._id}`).set("Cookie", cookies);
      expect(res.status).toBe(200);

      // Should not appear in explore
      const explore = await request(app).get("/api/content");
      expect(explore.body.data.find((c) => c._id === content._id)).toBeUndefined();
    });
  });
});
