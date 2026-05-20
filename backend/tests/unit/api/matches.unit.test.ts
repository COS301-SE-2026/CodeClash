import { request, app, userAuth, expectUnauthorized, expectArrayShape, expectShape, matchActionTests, idValidationTests } from '../helpers/test-utils'
import { describe, test, expect } from 'vitest';

const matchProps = ['match_id', 'player1', 'player2', 'status', 'started_at']

describe('Matches API', () => {
  describe('GET /matches', () => {
    test('returns 200 with paginated match list for authenticated user', async () => {
      const res = await request(app)
        .get('/matches')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((m: any) => {
        expect(m).toHaveProperty('match_id')
        expect(m).toHaveProperty('game_mode')
        expect(m).toHaveProperty('status')
        expect(m).toHaveProperty('winner_id')
      })
    })

    test('returns 200 filtered by status', async () => {
      const res = await request(app)
        .get('/matches?status=completed')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(200)
      res.body.forEach((m: any) => {
        expect(m.status).toBe('completed')
      })
    })

    test('returns 200 filtered by game_mode', async () => {
      const res = await request(app)
        .get('/matches?game_mode=ranked')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(200)
      res.body.forEach((m: any) => {
        expect(m.game_mode).toBe('ranked')
      })
    })

    test('returns 200 with limit applied', async () => {
      const res = await request(app)
        .get('/matches?limit=5')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(200)
      expect(res.body.length).toBeLessThanOrEqual(5)
    })

    test('returns 200 with offset applied', async () => {
      const res = await request(app)
        .get('/matches?offset=10')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })

    test('returns 401 without auth token', async () => {
      const res = await request(app).get('/matches')
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    test('returns 400 for invalid status value', async () => {
      const res = await request(app)
        .get('/matches?status=invalid_status')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('GET /matches/:match_id', () => {
    test('returns 200 with full match details', async () => {
      const res = await request(app).get('/matches/301')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('match_id', 301)
      expect(res.body).toHaveProperty('game_mode', 'ranked')
      expect(res.body).toHaveProperty('status', 'completed')
      expect(res.body).toHaveProperty('winner_id', 42)
    })

    idValidationTests('/matches')
  })

  describe('GET /matches/:match_id/rounds', () => {
    test('returns 200 with rounds array for match', async () => {
      const res = await request(app).get('/matches/301/rounds')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((r: any) => {
        expect(r).toHaveProperty('round_id')
        expect(r).toHaveProperty('match_id', 301)
        expect(r).toHaveProperty('problem_id')
        expect(r).toHaveProperty('start_time')
        expect(r).toHaveProperty('end_time')
      })
    })

    test('rounds are ordered by start_time ascending', async () => {
      const res = await request(app).get('/matches/301/rounds')
      expect(res.status).toBe(200)
      for (let i = 1; i < res.body.length; i++) {
        const prev = new Date(res.body[i - 1].start_time).getTime()
        const curr = new Date(res.body[i].start_time).getTime()
        expect(curr).toBeGreaterThanOrEqual(prev)
      }
    })

    test('returns 200 with empty array for match with no rounds', async () => {
      const res = await request(app).get('/matches/303/rounds')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    idValidationTests('/users', '99999', '/matches')
  })

  describe('GET /rounds/:round_id', () => {
    test('returns 200 with full round details', async () => {
      const res = await request(app).get('/rounds/7')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        round_id: 7,
        match_id: 301,
        problem_id: 15,
        start_time: '2025-04-15T10:05:00Z',
        end_time: '2025-04-15T10:20:00Z',
      })
    })

    test('returns 404 for non-existent round', async () => {
      const res = await request(app).get('/rounds/999')
      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })

    test('returns 400 for non-integer round_id', async () => {
      const res = await request(app).get('/rounds/abc')
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })
  })
})
