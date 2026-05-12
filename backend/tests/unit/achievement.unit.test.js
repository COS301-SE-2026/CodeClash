const request = require("supertest");
const app = require("../../src/app");

describe("Achievements API", () => {
  describe("GET /achievements", () => {
    test("returns 200 with full achievement catalog", async () => {
      const res = await request(app).get("/achievements");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      res.body.forEach((a) => {
        expect(a).toHaveProperty("achievement_id");
        expect(a).toHaveProperty("name");
        expect(a).toHaveProperty("description");
        expect(a).toHaveProperty("condition");
      });
    });

    test('includes "First Blood" achievement in catalog', async () => {
      const res = await request(app).get("/achievements");
      expect(res.status).toBe(200);
      const names = res.body.map((a) => a.name);
      expect(names).toContain("First Blood");
    });

    test("returns 200 with limit applied", async () => {
      const res = await request(app).get("/achievements?limit=2");
      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(2);
    });

    test("returns 200 with offset applied", async () => {
      const res = await request(app).get("/achievements?offset=1");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("returns 200 with limit and offset combined", async () => {
      const res = await request(app).get("/achievements?limit=1&offset=1");
      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(1);
    });

    test("returns 400 for negative limit", async () => {
      const res = await request(app).get("/achievements?limit=-1");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 for non-integer offset", async () => {
      const res = await request(app).get("/achievements?offset=abc");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /achievements/:achievement_id", () => {
    test("returns 200 with achievement details", async () => {
      const res = await request(app).get("/achievements/1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("achievement_id", 1);
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("description");
      expect(res.body).toHaveProperty("condition");
    });

    test("returns 404 for non-existent achievement", async () => {
      const res = await request(app).get("/achievements/999");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 for non-integer achievement_id", async () => {
      const res = await request(app).get("/achievements/abc");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /users/:user_id/achievements", () => {
    test("returns 200 with user achievements including nested achievement data", async () => {
      const res = await request(app).get("/users/42/achievements");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((ua) => {
        expect(ua).toHaveProperty("user_achievement_id");
        expect(ua).toHaveProperty("user_id", 42);
        expect(ua).toHaveProperty("achievement_id");
        expect(ua).toHaveProperty("unlocked_at");
        expect(ua).toHaveProperty("achievement");
        expect(ua.achievement).toHaveProperty("name");
        expect(ua.achievement).toHaveProperty("description");
      });
    });

    test('includes "First Blood" with unlock timestamp for user who has it', async () => {
      const res = await request(app).get("/users/42/achievements");
      const firstBlood = res.body.find(
        (ua) => ua.achievement.name === "First Blood",
      );
      expect(firstBlood).toBeDefined();
      expect(firstBlood.unlocked_at).toBeDefined();
    });

    test("returns 200 with empty array for user with no achievements", async () => {
      const res = await request(app).get("/users/1/achievements");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test("returns 404 for non-existent user", async () => {
      const res = await request(app).get("/users/99999/achievements");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 for invalid user_id", async () => {
      const res = await request(app).get("/users/abc/achievements");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
