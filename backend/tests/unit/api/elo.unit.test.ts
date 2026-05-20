import { request, app, expectNotFound, expectValidationError, expectEmptyArray, expectArrayShape } from '../helpers/test-utils'
import { describe, test, expect } from 'vitest';

const eloProps = ['elo_id', 'user_id', 'game_mode', 'rating', 'updated_at']

describe('ELO Ratings API', () => {
  describe('GET /users/:user_id/elo', () => {
    test('returns 200 with array of ELO ratings for user', async () => {
      const res = await request(app).get('/users/42/elo')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expectArrayShape(res.body, eloProps)
      res.body.forEach((entry: any) => {
        expect(entry.user_id).toBe(42)
      })
    })

    test('returns array with multiple game modes if user has played them', async () => {
      const res = await request(app).get('/users/42/elo')
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThanOrEqual(1)
    })

    test('returns 200 with empty array for user with no ELO history', async () => {
      expectEmptyArray(await request(app).get('/users/1/elo'))
    })

    test('returns 404 for non-existent user', async () => {
      expectNotFound(await request(app).get('/users/99999/elo'))
    })

    test('returns 400 for invalid user_id', async () => {
      expectValidationError(await request(app).get('/users/abc/elo'))
    })
  })

  describe('GET /users/:user_id/elo/:game_mode', () => {
    test('returns 200 with single ELO rating for specified game mode', async () => {
      const res = await request(app).get('/users/42/elo/blitz')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('elo_id', 5)
      expect(res.body).toHaveProperty('user_id', 42)
      expect(res.body).toHaveProperty('game_mode', 'blitz')
      expect(res.body).toHaveProperty('rating', 1420)
      expect(res.body).toHaveProperty('updated_at')
    })

    test('returns 200 for "ranked" game mode', async () => {
      const res = await request(app).get('/users/42/elo/ranked')
      expect(res.status).toBe(200)
      expect(res.body.game_mode).toBe('ranked')
      expect(res.body).toHaveProperty('rating')
    })

    test('returns 200 for "math" game mode', async () => {
      const res = await request(app).get('/users/42/elo/math')
      expect(res.status).toBe(200)
      expect(res.body.game_mode).toBe('math')
    })

    test('returns 404 for non-existent game mode for user', async () => {
      expectNotFound(await request(app).get('/users/42/elo/unknown_mode'))
    })

    test('returns 404 for non-existent user', async () => {
      expectNotFound(await request(app).get('/users/99999/elo/blitz'))
    })

    test('returns 400 for invalid user_id', async () => {
      expectValidationError(await request(app).get('/users/abc/elo/blitz'))
    })
  })
})
