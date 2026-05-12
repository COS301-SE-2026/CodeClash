const request = require("supertest");
const app = require("../../src/app");

describe("Problems API", () => {
  describe("GET /problems", () => {
    test("returns 200 with paginated problem list", async () => {
      const res = await request(app).get("/problems");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((p) => {
        expect(p).toHaveProperty("problem_id");
        expect(p).toHaveProperty("problem_category");
        expect(p).toHaveProperty("difficulty_level");
        expect(p).toHaveProperty("title");
        expect(p).toHaveProperty("time_limit");
      });
    });

    test("returns 200 filtered by problem_category=programming", async () => {
      const res = await request(app).get(
        "/problems?problem_category=programming",
      );
      expect(res.status).toBe(200);
      res.body.forEach((p) => {
        expect(p.problem_category).toBe("programming");
      });
    });

    test("returns 200 filtered by problem_category=math", async () => {
      const res = await request(app).get("/problems?problem_category=math");
      expect(res.status).toBe(200);
      res.body.forEach((p) => {
        expect(p.problem_category).toBe("math");
      });
    });

    test("returns 200 filtered by difficulty_level", async () => {
      const res = await request(app).get("/problems?difficulty_level=medium");
      expect(res.status).toBe(200);
      res.body.forEach((p) => {
        expect(p.difficulty_level).toBe("medium");
      });
    });

    test("returns 200 filtered by category", async () => {
      const res = await request(app).get("/problems?category=graphs");
      expect(res.status).toBe(200);
    });

    test("returns 200 with limit applied", async () => {
      const res = await request(app).get("/problems?limit=3");
      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(3);
    });

    test("returns 200 with offset applied", async () => {
      const res = await request(app).get("/problems?offset=5");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("returns 400 for invalid problem_category", async () => {
      const res = await request(app).get("/problems?problem_category=invalid");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 for negative limit", async () => {
      const res = await request(app).get("/problems?limit=-1");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /problems/:problem_id", () => {
    test("returns 200 with programming problem details", async () => {
      const res = await request(app).get("/problems/15");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("problem_id", 15);
      expect(res.body).toHaveProperty("problem_category", "programming");
      expect(res.body).toHaveProperty("difficulty_level", "medium");
      expect(res.body).toHaveProperty("title", "Shortest Path");
      expect(res.body).toHaveProperty("description");
      expect(res.body).toHaveProperty("time_limit", 2000);
      expect(res.body).toHaveProperty("supported_languages");
      expect(Array.isArray(res.body.supported_languages)).toBe(true);
    });

    test("returns 200 with math problem details including solution_formula", async () => {
      const res = await request(app).get("/problems/22");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("problem_id", 22);
      expect(res.body).toHaveProperty("problem_category", "math");
      expect(res.body).toHaveProperty("difficulty_level", "hard");
      expect(res.body).toHaveProperty("title", "Integral Bounds");
      expect(res.body).toHaveProperty("description");
      expect(res.body).toHaveProperty("time_limit", 3000);
      expect(res.body).toHaveProperty("solution_formula");
    });

    test("returns 404 for non-existent problem", async () => {
      const res = await request(app).get("/problems/999");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 for non-integer problem_id", async () => {
      const res = await request(app).get("/problems/abc");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /problems", () => {
    const programmingProblem = {
      problem_category: "programming",
      title: "New Problem",
      description: "A new problem description",
      difficulty_level: "easy",
      time_limit: 1000,
      supported_languages: ["java", "c++"],
    };

    const mathProblem = {
      problem_category: "math",
      title: "New Math Problem",
      description: "A math problem",
      difficulty_level: "medium",
      time_limit: 2000,
      solution_formula: "42",
    };

    test("returns 201 for valid programming problem (admin)", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send(programmingProblem);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("problem_id");
      expect(res.body).toHaveProperty("problem_category", "programming");
      expect(res.body).toHaveProperty("title", "New Problem");
      expect(res.body).toHaveProperty("supported_languages", ["java", "c++"]);
    });

    test("returns 201 for valid math problem (admin)", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send(mathProblem);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("problem_category", "math");
      expect(res.body).toHaveProperty("solution_formula", "42");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).post("/problems").send(programmingProblem);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 with non-admin token", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer valid-jwt")
        .send(programmingProblem);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 400 when title is missing", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send({ problem_category: "programming" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 when description is missing", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send({ problem_category: "programming", title: "Test" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 when difficulty_level is missing", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send({
          problem_category: "programming",
          title: "Test",
          description: "Desc",
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 when time_limit is missing", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send({
          problem_category: "programming",
          title: "Test",
          description: "Desc",
          difficulty_level: "easy",
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 for programming problem missing supported_languages", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send({
          problem_category: "programming",
          title: "Test",
          description: "Desc",
          difficulty_level: "easy",
          time_limit: 1000,
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 for math problem missing solution_formula", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send({
          problem_category: "math",
          title: "Test",
          description: "Desc",
          difficulty_level: "easy",
          time_limit: 1000,
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 for invalid problem_category", async () => {
      const res = await request(app)
        .post("/problems")
        .set("Authorization", "Bearer admin-jwt")
        .send({
          problem_category: "invalid",
          title: "Test",
          description: "Desc",
          difficulty_level: "easy",
          time_limit: 1000,
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("PUT /problems/:problem_id", () => {
    const validUpdate = { title: "Updated Title", difficulty_level: "hard" };

    test("returns 200 for valid partial update (admin)", async () => {
      const res = await request(app)
        .put("/problems/15")
        .set("Authorization", "Bearer admin-jwt")
        .send(validUpdate);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("problem_id", 15);
      expect(res.body).toHaveProperty("title", "Updated Title");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).put("/problems/15").send(validUpdate);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 with non-admin token", async () => {
      const res = await request(app)
        .put("/problems/15")
        .set("Authorization", "Bearer valid-jwt")
        .send(validUpdate);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for non-existent problem", async () => {
      const res = await request(app)
        .put("/problems/999")
        .set("Authorization", "Bearer admin-jwt")
        .send(validUpdate);
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 when trying to change problem_category", async () => {
      const res = await request(app)
        .put("/problems/15")
        .set("Authorization", "Bearer admin-jwt")
        .send({ problem_category: "math" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("DELETE /problems/:problem_id", () => {
    test("returns 204 when problem has no active rounds (admin)", async () => {
      const res = await request(app)
        .delete("/problems/15")
        .set("Authorization", "Bearer admin-jwt");
      expect(res.status).toBe(204);
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).delete("/problems/15");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 with non-admin token", async () => {
      const res = await request(app)
        .delete("/problems/15")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for non-existent problem", async () => {
      const res = await request(app)
        .delete("/problems/999")
        .set("Authorization", "Bearer admin-jwt");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 409 if problem is referenced by active rounds", async () => {
      const res = await request(app)
        .delete("/problems/1")
        .set("Authorization", "Bearer admin-jwt");
      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("CONFLICT");
    });

    test("returns 400 for non-integer problem_id", async () => {
      const res = await request(app)
        .delete("/problems/abc")
        .set("Authorization", "Bearer admin-jwt");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /problems/:problem_id/testcases", () => {
    test("returns 200 with test cases array", async () => {
      const res = await request(app).get("/problems/15/testcases");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((tc) => {
        expect(tc).toHaveProperty("testcase_id");
        expect(tc).toHaveProperty("problem_id", 15);
        expect(tc).toHaveProperty("input");
        expect(tc).toHaveProperty("expected_output");
      });
    });

    test("returns 404 for non-existent problem", async () => {
      const res = await request(app).get("/problems/999/testcases");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("returns 400 for non-integer problem_id", async () => {
      const res = await request(app).get("/problems/abc/testcases");
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /problems/:problem_id/testcases", () => {
    const validBody = {
      input: "5\n1 3\n3 5",
      expected_output: "2",
    };

    test("returns 201 for valid test case (admin)", async () => {
      const res = await request(app)
        .post("/problems/15/testcases")
        .set("Authorization", "Bearer admin-jwt")
        .send(validBody);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("testcase_id");
      expect(res.body).toHaveProperty("problem_id", 15);
      expect(res.body).toHaveProperty("input", "5\n1 3\n3 5");
      expect(res.body).toHaveProperty("expected_output", "2");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app)
        .post("/problems/15/testcases")
        .send(validBody);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 with non-admin token", async () => {
      const res = await request(app)
        .post("/problems/15/testcases")
        .set("Authorization", "Bearer valid-jwt")
        .send(validBody);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 400 when input is missing", async () => {
      const res = await request(app)
        .post("/problems/15/testcases")
        .set("Authorization", "Bearer admin-jwt")
        .send({ expected_output: "2" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 400 when expected_output is missing", async () => {
      const res = await request(app)
        .post("/problems/15/testcases")
        .set("Authorization", "Bearer admin-jwt")
        .send({ input: "5\n1 3\n3 5" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("returns 404 for non-existent problem", async () => {
      const res = await request(app)
        .post("/problems/999/testcases")
        .set("Authorization", "Bearer admin-jwt")
        .send(validBody);
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("PUT /testcases/:testcase_id", () => {
    const validUpdate = {
      input: "3\n1 2\n2 3",
      expected_output: "2",
    };

    test("returns 200 for valid update (admin)", async () => {
      const res = await request(app)
        .put("/testcases/92")
        .set("Authorization", "Bearer admin-jwt")
        .send(validUpdate);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("testcase_id", 92);
      expect(res.body).toHaveProperty("input", "3\n1 2\n2 3");
    });

    test("returns 200 for partial update of just input (admin)", async () => {
      const res = await request(app)
        .put("/testcases/92")
        .set("Authorization", "Bearer admin-jwt")
        .send({ input: "1\n1 1" });
      expect(res.status).toBe(200);
      expect(res.body.input).toBe("1\n1 1");
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).put("/testcases/92").send(validUpdate);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 with non-admin token", async () => {
      const res = await request(app)
        .put("/testcases/92")
        .set("Authorization", "Bearer valid-jwt")
        .send(validUpdate);
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for non-existent test case", async () => {
      const res = await request(app)
        .put("/testcases/999")
        .set("Authorization", "Bearer admin-jwt")
        .send(validUpdate);
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("DELETE /testcases/:testcase_id", () => {
    test("returns 204 (admin)", async () => {
      const res = await request(app)
        .delete("/testcases/92")
        .set("Authorization", "Bearer admin-jwt");
      expect(res.status).toBe(204);
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app).delete("/testcases/92");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("returns 403 with non-admin token", async () => {
      const res = await request(app)
        .delete("/testcases/92")
        .set("Authorization", "Bearer valid-jwt");
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for non-existent test case", async () => {
      const res = await request(app)
        .delete("/testcases/999")
        .set("Authorization", "Bearer admin-jwt");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });
});
