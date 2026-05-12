const request = require("supertest");

describe("Users API", () => {
  describe("GET /users/:user_id", () => {
    test("returns 200 with user profile for valid id", async () => {
      const res = await request(app).get("/users/42");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user_id", 42);
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("created_at");
    });

    test("returns 404 for non-existent user", async () => {
      const res = await request(app).get("/users/99999");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 for invalid user_id type", async () => {
      const res = await request(app).get("/users/abc");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("PUT /users/:user_id", () => {
    const validUpdate = { username: "striker_v2", email: "new@example.com" };

    test("returns 200 and updated profile when authorized", async () => {
      const res = await request(app)
        .put("/users/42")
        .set("Authorization", "Bearer valid-jwt")
        .send(validUpdate);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("username", "striker_v2");
      expect(res.body).toHaveProperty("email", "new@example.com");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).put("/users/42").send(validUpdate);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 when updating another user", async () => {
      const res = await request(app)
        .put("/users/1")
        .set("Authorization", "Bearer valid-jwt")
        .send(validUpdate);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 400 for invalid email", async () => {
      const res = await request(app)
        .put("/users/42")
        .set("Authorization", "Bearer valid-jwt")
        .send({ email: "not-an-email" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 200 with partial update (single field)", async () => {
      const res = await request(app)
        .put("/users/42")
        .set("Authorization", "Bearer valid-jwt")
        .send({ username: "new_name_only" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("username", "new_name_only");
    });

    test("returns 404 for non-existent user", async () => {
      const res = await request(app)
        .put("/users/99999")
        .set("Authorization", "Bearer valid-jwt")
        .send(validUpdate);
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("DELETE /users/:user_id", () => {
    test("returns 204 when authorized", async () => {
      const res = await request(app)
        .delete("/users/42")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(204);
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).delete("/users/42");
      expect(res.status).toBe(401);
    });

    test("returns 403 when deleting another user", async () => {
      const res = await request(app)
        .delete("/users/1")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(403);
    });

    test("returns 404 for non-existent user", async () => {
      const res = await request(app)
        .delete("/users/99999")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(404);
    });
  });
});
