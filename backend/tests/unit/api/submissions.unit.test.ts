import { request, app, userAuth, expectNotFound, expectValidationError, expectUnauthorized, expectForbidden, expectArrayResponse, expectShape } from '../helpers/test-utils'

const submissionProps = ['submission_id', 'user_id', 'problem_id', 'status', 'submitted_at']

describe('Submissions / Execution Results API', () => {
  describe('GET /submissions', () => {
    test('returns 200 with all submissions for authenticated user', async () => {
      const res = await request(app)
        .get('/submissions')
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((s: any) => {
        expect(s.user_id).toBe(42)
      })
    })

    test('returns 200 with problem_id filter', async () => {
      const res = await request(app)
        .get('/submissions?problem_id=1')
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      res.body.forEach((s: any) => {
        expect(s.problem_id).toBe(1)
      })
    })

    test('returns 200 with status filter', async () => {
      const res = await request(app)
        .get('/submissions?status=accepted')
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      res.body.forEach((s: any) => {
        expect(s.status).toBe('accepted')
      })
    })

    test('returns 200 with combined filters', async () => {
      const res = await request(app)
        .get('/submissions?problem_id=1&status=accepted')
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      res.body.forEach((s: any) => {
        expect(s.problem_id).toBe(1)
        expect(s.status).toBe('accepted')
      })
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(await request(app).get('/submissions'))
    })
  })

  describe('GET /submissions/:submission_id', () => {
    test('returns 200 with submission details', async () => {
      const res = await request(app)
        .get('/submissions/1')
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      expectShape(res.body, [...submissionProps, 'language', 'code_length'])
      expect(res.body.submission_id).toBe(1)
    })

    test('returns 403 when submission belongs to different user', async () => {
      expectForbidden(
        await request(app).get('/submissions/1').set('Authorization', 'Bearer other-user-jwt')
      )
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(await request(app).get('/submissions/1'))
    })

    test('returns 404 for non-existent submission', async () => {
      expectNotFound(
        await request(app).get('/submissions/99999').set('Authorization', userAuth)
      )
    })

    test('returns 400 for non-integer submission_id', async () => {
      expectValidationError(
        await request(app).get('/submissions/abc').set('Authorization', userAuth)
      )
    })
  })

  describe('POST /submissions', () => {
    const validSubmission = {
      problem_id: 1,
      language: 'python',
      code: 'print("hello")',
    }

    test('returns 201 when user submits code', async () => {
      const res = await request(app)
        .post('/submissions')
        .set('Authorization', userAuth)
        .send(validSubmission)
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('submission_id')
      expect(res.body.status).toBe('pending')
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(
        await request(app).post('/submissions').send(validSubmission)
      )
    })

    test('returns 400 for missing required fields', async () => {
      expectValidationError(
        await request(app)
          .post('/submissions')
          .set('Authorization', userAuth)
          .send({})
      )
    })

    test('returns 400 for empty language field', async () => {
      expectValidationError(
        await request(app)
          .post('/submissions')
          .set('Authorization', userAuth)
          .send({ ...validSubmission, language: '' })
      )
    })

    test('returns 400 for non-existent problem_id', async () => {
      expectValidationError(
        await request(app)
          .post('/submissions')
          .set('Authorization', userAuth)
          .send({ ...validSubmission, problem_id: 99999 })
      )
    })

    test('returns 201 for long code submission', async () => {
      const res = await request(app)
        .post('/submissions')
        .set('Authorization', userAuth)
        .send({
          problem_id: 1,
          language: 'javascript',
          code: 'x'.repeat(10000),
        })
      expect(res.status).toBe(201)
    })

    test('returns 400 for unsupported language', async () => {
      expectValidationError(
        await request(app)
          .post('/submissions')
          .set('Authorization', userAuth)
          .send({ ...validSubmission, language: 'brainfuck' })
      )
    })
  })

  describe('GET /submissions/:submission_id/result', () => {
    test('returns 200 with execution result', async () => {
      const res = await request(app)
        .get('/submissions/1/result')
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      expectShape(res.body, ['submission_id', 'status', 'passed', 'total', 'execution_time'])
    })

    test('returns 200 with detailed test case results', async () => {
      const res = await request(app)
        .get('/submissions/1/result')
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      if (res.body.test_cases) {
        res.body.test_cases.forEach((tc: any) => {
          expect(tc).toHaveProperty('test_case_id')
          expect(tc).toHaveProperty('passed')
        })
      }
    })

    test('returns 403 when result belongs to different user', async () => {
      expectForbidden(
        await request(app)
          .get('/submissions/1/result')
          .set('Authorization', 'Bearer other-user-jwt')
      )
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(await request(app).get('/submissions/1/result'))
    })

    test('returns 404 for non-existent submission', async () => {
      expectNotFound(
        await request(app)
          .get('/submissions/99999/result')
          .set('Authorization', userAuth)
      )
    })
  })
})
