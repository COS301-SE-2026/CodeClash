import { request, app, userAuth, adminAuth, expectNotFound, expectValidationError, expectUnauthorized, expectForbidden, expectConflict, expectUnprocessable, expectArrayResponse, expectShape } from '../helpers/test-utils'

const problemProps = ['problem_id', 'title', 'difficulty', 'problem_type']

describe('Problems API', () => {
  describe('GET /problems', () => {
    test('returns 200 with problem list', async () => {
      const res = await request(app).get('/problems')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })

    test('returns 200 with difficulty filter', async () => {
      const res = await request(app).get('/problems?difficulty=medium')
      expect(res.status).toBe(200)
      res.body.forEach((p: any) => {
        expect(p.difficulty).toBe('medium')
      })
    })

    test('returns 200 with problem_type filter', async () => {
      const res = await request(app).get('/problems?problem_type=math')
      expect(res.status).toBe(200)
      res.body.forEach((p: any) => {
        expect(p.problem_type).toBe('math')
      })
    })

    test('returns 200 with combined filters', async () => {
      const res = await request(app).get('/problems?difficulty=hard&problem_type=algorithm')
      expect(res.status).toBe(200)
      res.body.forEach((p: any) => {
        expect(p.difficulty).toBe('hard')
        expect(p.problem_type).toBe('algorithm')
      })
    })

    test('returns 200 with empty array for non-existent difficulty', async () => {
      const res = await request(app).get('/problems?difficulty=impossible')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    test('returns 200 with limit applied', async () => {
      const res = await request(app).get('/problems?limit=3')
      expect(res.status).toBe(200)
      expect(res.body.length).toBeLessThanOrEqual(3)
    })

    test('returns 200 with offset applied', async () => {
      expectArrayResponse(await request(app).get('/problems?offset=2'))
    })

    test('returns 400 for negative limit', async () => {
      expectValidationError(await request(app).get('/problems?limit=-1'))
    })

    test('returns 400 for non-integer offset', async () => {
      expectValidationError(await request(app).get('/problems?offset=abc'))
    })
  })

  describe('GET /problems/:problem_id', () => {
    test('returns 200 with problem details', async () => {
      const res = await request(app).get('/problems/1')
      expect(res.status).toBe(200)
      expectShape(res.body, problemProps)
      expect(res.body.problem_id).toBe(1)
    })

    test('returns 404 for non-existent problem', async () => {
      expectNotFound(await request(app).get('/problems/99999'))
    })

    test('returns 400 for non-integer problem_id', async () => {
      expectValidationError(await request(app).get('/problems/abc'))
    })
  })

  describe('GET /problems/:problem_id/test-cases', () => {
    test('returns 200 with test cases for a problem', async () => {
      const res = await request(app).get('/problems/1/test-cases')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((tc: any) => {
        expect(tc).toHaveProperty('test_case_id')
        expect(tc).toHaveProperty('input')
        expect(tc).toHaveProperty('expected_output')
      })
    })

    test('returns 200 with empty array when problem has no test cases', async () => {
      const res = await request(app).get('/problems/99/test-cases')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('POST /problems', () => {
    const newProblem = {
      title: 'New Challenge',
      description: 'Solve this new problem',
      difficulty: 'medium',
      problem_type: 'algorithm',
    }

    test('returns 201 when admin creates problem', async () => {
      const res = await request(app)
        .post('/problems')
        .set('Authorization', adminAuth)
        .send(newProblem)
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('problem_id')
      expect(res.body.title).toBe('New Challenge')
    })

    test('returns 403 when regular user creates problem', async () => {
      expectForbidden(
        await request(app)
          .post('/problems')
          .set('Authorization', userAuth)
          .send(newProblem)
      )
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(await request(app).post('/problems').send(newProblem))
    })

    test('returns 400 for missing required fields', async () => {
      expectValidationError(
        await request(app)
          .post('/problems')
          .set('Authorization', adminAuth)
          .send({})
      )
    })

    test('returns 400 for empty title', async () => {
      expectValidationError(
        await request(app)
          .post('/problems')
          .set('Authorization', adminAuth)
          .send({ ...newProblem, title: '' })
      )
    })

    test('returns 409 for duplicate title', async () => {
      expectConflict(
        await request(app)
          .post('/problems')
          .set('Authorization', adminAuth)
          .send({ ...newProblem, title: 'Duplicate Title' })
      )
    })
  })

  describe('PUT /problems/:problem_id', () => {
    const updateData = { title: 'Updated Title', difficulty: 'hard' }

    test('returns 200 when admin updates problem', async () => {
      const res = await request(app)
        .put('/problems/1')
        .set('Authorization', adminAuth)
        .send(updateData)
      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Updated Title')
    })

    test('returns 403 when regular user updates problem', async () => {
      expectForbidden(
        await request(app)
          .put('/problems/1')
          .set('Authorization', userAuth)
          .send(updateData)
      )
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(
        await request(app).put('/problems/1').send(updateData)
      )
    })

    test('returns 404 for non-existent problem', async () => {
      expectNotFound(
        await request(app)
          .put('/problems/99999')
          .set('Authorization', adminAuth)
          .send({ title: 'Ghost' })
      )
    })

    test('returns 400 for invalid difficulty', async () => {
      expectValidationError(
        await request(app)
          .put('/problems/1')
          .set('Authorization', adminAuth)
          .send({ difficulty: 'godly' })
      )
    })

    test('returns 409 for duplicate title after update', async () => {
      expectConflict(
        await request(app)
          .put('/problems/1')
          .set('Authorization', adminAuth)
          .send({ title: 'Existing Title' })
      )
    })
  })

  describe('DELETE /problems/:problem_id', () => {
    test('returns 204 when admin deletes problem', async () => {
      const res = await request(app)
        .delete('/problems/1')
        .set('Authorization', adminAuth)
      expect(res.status).toBe(204)
    })

    test('returns 403 when regular user deletes problem', async () => {
      expectForbidden(
        await request(app).delete('/problems/1').set('Authorization', userAuth)
      )
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(await request(app).delete('/problems/1'))
    })

    test('returns 404 for non-existent problem', async () => {
      expectNotFound(
        await request(app).delete('/problems/99999').set('Authorization', adminAuth)
      )
    })
  })

  describe('GET /users/:user_id/statistics', () => {
    test('returns 200 with user statistics including problems solved', async () => {
      const res = await request(app).get('/users/42/statistics')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('problems_solved')
      expect(res.body).toHaveProperty('matches_played')
      expect(res.body).toHaveProperty('win_rate')
      expect(typeof res.body.win_rate).toBe('number')
    })

    test('returns 200 with zero stats for user with no activity', async () => {
      const res = await request(app).get('/users/1/statistics')
      expect(res.status).toBe(200)
      expect(res.body.problems_solved).toBe(0)
      expect(res.body.matches_played).toBe(0)
    })

    test('returns 404 for non-existent user', async () => {
      expectNotFound(await request(app).get('/users/99999/statistics'))
    })
  })
})
