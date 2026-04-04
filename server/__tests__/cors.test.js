const request = require("supertest");
const app = require("../app");

describe("CORS", () => {
  it("reflects any browser origin for credentialed requests", async () => {
    const origin = "https://prompt-hive-ebon.vercel.app";

    const res = await request(app).get("/api/auth/me").set("Origin", origin);

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe(origin);
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("handles preflight requests from any origin", async () => {
    const origin = "https://example.com";

    const res = await request(app)
      .options("/api/auth/me")
      .set("Origin", origin)
      .set("Access-Control-Request-Method", "GET");

    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe(origin);
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});
