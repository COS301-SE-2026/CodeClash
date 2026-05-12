const request = require("supertest");
const app = require("../../src/app");

describe("ELO Ratings API", () => {
  describe("GET /users/:user_id/elo", () => {
    test("returns 200 with array of ELO ratings for user", async () => {
      const res = await request(app).get("/users/42/elo");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((entry) => {
        expect(entry).toHaveProperty("elo_id");
        expect(entry).toHaveProperty("user_id", 42);
        expect(entry).toHaveProperty("game_mode");
        expect(entry).toHaveProperty("rating");
        expect(entry).toHaveProperty("updated_at");
      });
    });

    test("returns array with multiple game modes if user has played them", async () => {
      const res = await request(app).get("/users/42/elo");
      expect(res.status).toBe(200);
      const modes = res.body.map((e) => e.game_mode);
      expect(modes.length).toBeGreaterThanOrEqual(1);
    });

    test("returns 200 with empty array for user with no ELO history", async () => {
      const res = await request(app).get("/users/1/elo");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test("returns 404 for non-existent user", async () => {
      const res = await request(app).get("/users/99999/elo");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 for invalid user_id", async () => {
      const res = await request(app).get("/users/abc/elo");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /users/:user_id/elo/:game_mode", () => {
    test("returns 200 with single ELO rating for specified game mode", async () => {
      const res = await request(app).get("/users/42/elo/blitz");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("elo_id", 5);
      expect(res.body).toHaveProperty("user_id", 42);
      expect(res.body).toHaveProperty("game_mode", "blitz");
      expect(res.body).toHaveProperty("rating", 1420);
      expect(res.body).toHaveProperty("updated_at");
    });

    test('returns 200 for "ranked" game mode', async () => {
      const res = await request(app).get("/users/42/elo/ranked");
      expect(res.status).toBe(200);
      expect(res.body.game_mode).toBe("ranked");
      expect(res.body).toHaveProperty("rating");
    });

    test('returns 200 for "math" game mode', async () => {
      const res = await request(app).get("/users/42/elo/math");
      expect(res.status).toBe(200);
      expect(res.body.game_mode).toBe("math");
    });

    test("returns 404 for non-existent game mode for user", async () => {
      const res = await request(app).get("/users/42/elo/unknown_mode");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 404 for non-existent user", async () => {
      const res = await request(app).get("/users/99999/elo/blitz");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 for invalid user_id", async () => {
      const res = await request(app).get("/users/abc/elo/blitz");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
