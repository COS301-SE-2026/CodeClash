const request = require("supertest");
const app = require("../../src/app");

describe("Submissions API", () => {
  describe("POST /submissions", () => {
    const validBody = {
      round_id: 7,
      code: "def solve(n, edges): pass",
      language: "java",
    };

    test("returns 201 with pending submission", async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send(validBody);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("submission_id", 550);
      expect(res.body).toHaveProperty("user_id", 42);
      expect(res.body).toHaveProperty("round_id", 7);
      expect(res.body).toHaveProperty("language", "java");
      expect(res.body).toHaveProperty("status", "pending");
      expect(res.body).toHaveProperty("submitted_at");
    });

    test('returns 201 with language "c++"', async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send({ ...validBody, language: "c++" });
      expect(res.status).toBe(201);
      expect(res.body.language).toBe("c++");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).post("/submissions").send(validBody);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 400 when round_id is missing", async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send({ code: "def solve(): pass", language: "java" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 when code is missing", async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send({ round_id: 7, language: "java" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 when language is missing", async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send({ round_id: 7, code: "def solve(): pass" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 for unsupported language", async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send({ round_id: 7, code: "print(1)", language: "python" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 for empty code", async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send({ round_id: 7, code: "", language: "java" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 422 for non-existent round", async () => {
      const res = await request(app)
        .post("/submissions")
        .set("Authorization", "Bearer valid-jwt")
        .send({ round_id: 999, code: "def solve(): pass", language: "java" });
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("UNPROCESSABLE");
    });
  });

  describe("GET /submissions/:submission_id", () => {
    test("returns 200 with full submission details", async () => {
      const res = await request(app)
        .get("/submissions/550")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("submission_id", 550);
      expect(res.body).toHaveProperty("user_id", 42);
      expect(res.body).toHaveProperty("round_id", 7);
      expect(res.body).toHaveProperty("code");
      expect(res.body).toHaveProperty("language");
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("submitted_at");
    });

    test('status can be "pending"', async () => {
      const res = await request(app)
        .get("/submissions/550")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      expect([
        "pending",
        "running",
        "accepted",
        "wrong_answer",
        "time_limit_exceeded",
        "runtime_error",
      ]).toContain(res.body.status);
    });

    test('status can be "accepted"', async () => {
      const res = await request(app)
        .get("/submissions/551")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("accepted");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).get("/submissions/550");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 if submission belongs to another user", async () => {
      const res = await request(app)
        .get("/submissions/550")
        .set("Authorization", "Bearer other-user-jwt");
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for non-existent submission", async () => {
      const res = await request(app)
        .get("/submissions/999")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("GET /users/:user_id/submissions", () => {
    test("returns 200 with paginated submission list, newest first", async () => {
      const res = await request(app)
        .get("/users/42/submissions")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 1) {
        const prev = new Date(res.body[0].submitted_at).getTime();
        for (let i = 1; i < res.body.length; i++) {
          const curr = new Date(res.body[i].submitted_at).getTime();
          expect(prev).toBeGreaterThanOrEqual(curr);
        }
      }
    });

    test("returns 200 filtered by status", async () => {
      const res = await request(app)
        .get("/users/42/submissions?status=accepted")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      res.body.forEach((s) => {
        expect(s.status).toBe("accepted");
      });
    });

    test("returns 200 filtered by language", async () => {
      const res = await request(app)
        .get("/users/42/submissions?language=java")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      res.body.forEach((s) => {
        expect(s.language).toBe("java");
      });
    });

    test("returns 200 with limit applied", async () => {
      const res = await request(app)
        .get("/users/42/submissions?limit=5")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(5);
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).get("/users/42/submissions");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 when listing another user submissions", async () => {
      const res = await request(app)
        .get("/users/1/submissions")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for non-existent user", async () => {
      const res = await request(app)
        .get("/users/99999/submissions")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("GET /submissions/:submission_id/result", () => {
    test("returns 200 with execution result when processing is complete", async () => {
      const res = await request(app)
        .get("/submissions/550/result")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("result_id", 210);
      expect(res.body).toHaveProperty("submission_id", 550);
      expect(res.body).toHaveProperty("passed_cases");
      expect(res.body).toHaveProperty("total_cases");
      expect(res.body).toHaveProperty("execution_time");
      expect(res.body).toHaveProperty("memory_used");
    });

    test("passed_cases and total_cases are integers", async () => {
      const res = await request(app)
        .get("/submissions/550/result")
        .set("Authorization", "Bearer valid-jwt");
      expect(Number.isInteger(res.body.passed_cases)).toBe(true);
      expect(Number.isInteger(res.body.total_cases)).toBe(true);
    });

    test("execution_time is in milliseconds", async () => {
      const res = await request(app)
        .get("/submissions/550/result")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.body.execution_time).toBeGreaterThanOrEqual(0);
    });

    test("memory_used is in bytes", async () => {
      const res = await request(app)
        .get("/submissions/550/result")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.body.memory_used).toBeGreaterThanOrEqual(0);
    });

    test("returns 404 if execution not yet completed", async () => {
      const res = await request(app)
        .get("/submissions/551/result")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).get("/submissions/550/result");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 if submission belongs to another user", async () => {
      const res = await request(app)
        .get("/submissions/550/result")
        .set("Authorization", "Bearer other-user-jwt");
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for non-existent submission", async () => {
      const res = await request(app)
        .get("/submissions/999/result")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });
});
