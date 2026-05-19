import { request, app, userAuth, expectNotFound, expectValidationError, expectUnauthorized, expectArrayShape, expectShape, matchActionTests } from '../helpers/test-utils'
import { describe, test, expect } from 'vitest';

const matchProps = ['match_id', 'player1', 'player2', 'status', 'started_at']

describe('Matches API', () => {
  describe('GET /matches', () => {
    test('returns 200 with list of matches', async () => {
      const res = await request(app).get('/matches')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expectArrayShape(res.body, matchProps)
    })

    test('returns 200 with match status filter', async () => {
      const res = await request(app).get('/matches?status=completed')
      expect(res.status).toBe(200)
      res.body.forEach((m: any) => {
        expect(m.status).toBe('completed')
      })
    })

    test('returns 200 with empty array when no matches match filter', async () => {
      const res = await request(app).get('/matches?status=unknown_type')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('GET /matches/:match_id', () => {
    test('returns 200 with match details', async () => {
      const res = await request(app).get('/matches/1')
      expect(res.status).toBe(200)
      expectShape(res.body, [...matchProps, 'winner', 'duration'])
      expect(res.body.match_id).toBe(1)
    })

    test('returns 404 for non-existent match', async () => {
      expectNotFound(await request(app).get('/matches/99999'))
    })

    test('returns 400 for non-integer match_id', async () => {
      expectValidationError(await request(app).get('/matches/abc'))
    })
  })

  describe('GET /users/:user_id/matches', () => {
    test('returns 200 with match history for user', async () => {
      const res = await request(app).get('/users/42/matches')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((m: any) => {
        expect(m.player1 === 42 || m.player2 === 42).toBe(true)
      })
    })

    test('returns 200 with empty array for user with no matches', async () => {
      const res = await request(app).get('/users/1/matches')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    test('returns 404 for non-existent user', async () => {
      expectNotFound(await request(app).get('/users/99999/matches'))
    })

    test('returns 400 for invalid user_id', async () => {
      expectValidationError(await request(app).get('/users/abc/matches'))
    })
  })

  describe('POST /matches', () => {
    test('returns 201 with created match when invited player exists', async () => {
      const res = await request(app)
        .post('/matches')
        .set('Authorization', userAuth)
        .send({ invited_player_id: 3, game_mode: 'blitz' })
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('match_id')
      expect(res.body.status).toBe('pending')
      expect(res.body.player2).toBe(3)
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(
        await request(app).post('/matches').send({ invited_player_id: 3, game_mode: 'blitz' })
      )
    })

    test('returns 400 for missing required fields', async () => {
      expectValidationError(
        await request(app).post('/matches').set('Authorization', userAuth).send({})
      )
    })

    test('returns 400 for non-existent game_mode', async () => {
      expectValidationError(
        await request(app)
          .post('/matches')
          .set('Authorization', userAuth)
          .send({ invited_player_id: 3, game_mode: '' })
      )
    })
  })

  matchActionTests('accept', 'accepted')
  matchActionTests('decline', 'declined')
})
