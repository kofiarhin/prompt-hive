const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("./setup");
const app = require("../app");
const { createUser, createTestContent } = require("./helpers");

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("Engagement API", () => {
  describe("Vote - POST /api/vote/:contentId", () => {
    it("creates an upvote", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      const res = await request(app)
        .post(`/api/vote/${content._id}`)
        .set("Cookie", cookies)
        .send({ voteType: "up" });

      expect(res.status).toBe(200);
      expect(res.body.data.currentUserVote).toBe("up");
      expect(res.body.data.upvoteCount).toBe(1);
    });

    it("removes vote when same vote sent again", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      await request(app).post(`/api/vote/${content._id}`).set("Cookie", cookies).send({ voteType: "up" });
      const res = await request(app).post(`/api/vote/${content._id}`).set("Cookie", cookies).send({ voteType: "up" });

      expect(res.body.data.currentUserVote).toBeNull();
      expect(res.body.data.upvoteCount).toBe(0);
    });

    it("switches vote direction", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      await request(app).post(`/api/vote/${content._id}`).set("Cookie", cookies).send({ voteType: "up" });
      const res = await request(app).post(`/api/vote/${content._id}`).set("Cookie", cookies).send({ voteType: "down" });

      expect(res.body.data.currentUserVote).toBe("down");
      expect(res.body.data.upvoteCount).toBe(0);
      expect(res.body.data.downvoteCount).toBe(1);
    });

    it("rejects vote on private content", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies, { visibility: "private" });

      const { cookies: otherCookies } = await createUser({ username: "voter", email: "voter@test.com" });
      const res = await request(app)
        .post(`/api/vote/${content._id}`)
        .set("Cookie", otherCookies)
        .send({ voteType: "up" });

      expect(res.status).toBe(404);
    });

    it("rejects vote without auth", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      const res = await request(app).post(`/api/vote/${content._id}`).send({ voteType: "up" });
      expect(res.status).toBe(401);
    });
  });

  describe("Save - POST /api/save/:contentId", () => {
    it("saves content", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      const res = await request(app).post(`/api/save/${content._id}`).set("Cookie", cookies);

      expect(res.status).toBe(201);
      expect(res.body.data.saved).toBeDefined();
    });

    it("blocks duplicate saves", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      await request(app).post(`/api/save/${content._id}`).set("Cookie", cookies);
      const res = await request(app).post(`/api/save/${content._id}`).set("Cookie", cookies);

      expect(res.status).toBe(409);
    });

    it("blocks saving deleted content", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      await request(app).delete(`/api/content/${content._id}`).set("Cookie", cookies);
      const { cookies: saverCookies } = await createUser({ username: "saver", email: "saver@test.com" });
      const res = await request(app).post(`/api/save/${content._id}`).set("Cookie", saverCookies);

      expect(res.status).toBe(404);
    });
  });

  describe("Save list - GET /api/save", () => {
    it("returns saved content ordered", async () => {
      const { cookies } = await createUser();
      const c1 = await createTestContent(cookies, { title: "First" });
      const c2 = await createTestContent(cookies, { title: "Second" });

      await request(app).post(`/api/save/${c1._id}`).set("Cookie", cookies);
      await request(app).post(`/api/save/${c2._id}`).set("Cookie", cookies);

      const res = await request(app).get("/api/save").set("Cookie", cookies);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].order).toBeLessThan(res.body.data[1].order);
    });
  });

  describe("Unsave - DELETE /api/save/:contentId", () => {
    it("removes saved content", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      await request(app).post(`/api/save/${content._id}`).set("Cookie", cookies);
      const res = await request(app).delete(`/api/save/${content._id}`).set("Cookie", cookies);

      expect(res.status).toBe(200);

      const list = await request(app).get("/api/save").set("Cookie", cookies);
      expect(list.body.data.length).toBe(0);
    });
  });

  describe("Copy - POST /api/content/:id/copy", () => {
    it("increments copy count", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      const res = await request(app).post(`/api/content/${content._id}/copy`);
      expect(res.status).toBe(200);
      expect(res.body.data.copyCount).toBe(1);
    });

    it("rejects copy on deleted content", async () => {
      const { cookies } = await createUser();
      const content = await createTestContent(cookies);

      await request(app).delete(`/api/content/${content._id}`).set("Cookie", cookies);
      const res = await request(app).post(`/api/content/${content._id}/copy`);

      expect(res.status).toBe(404);
    });
  });
});
