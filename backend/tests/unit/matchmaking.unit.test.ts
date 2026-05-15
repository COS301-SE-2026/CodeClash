import request from 'supertest'
import app from '../../src/app'

describe('Matchmaking API', () => {
  describe('POST /matchmaking/join', () => {
    test('returns 201 when user joins queue with valid game_mode', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: 'ranked' })
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('queue_id')
      expect(res.body).toHaveProperty('user_id', 42)
      expect(res.body).toHaveProperty('game_mode', 'ranked')
      expect(res.body).toHaveProperty('elo_rating')
      expect(res.body).toHaveProperty('joined_at')
    })

    test('returns 201 for "blitz" game mode', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: 'blitz' })
      expect(res.status).toBe(201)
      expect(res.body.game_mode).toBe('blitz')
    })

    test('returns 201 for "math" game mode', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: 'math' })
      expect(res.status).toBe(201)
      expect(res.body.game_mode).toBe('math')
    })

    test('returns 401 without auth token', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .send({ game_mode: 'ranked' })
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    test('returns 400 when game_mode is missing', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({})
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    test('returns 400 for invalid game_mode', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: '' })
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    test('returns 409 if user is already in queue', async () => {
      await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: 'ranked' })

      const res2 = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: 'ranked' })
      expect(res2.status).toBe(409)
      expect(res2.body.error.code).toBe('CONFLICT')
    })
  })

  describe('DELETE /matchmaking/leave', () => {
    test('returns 204 when leaving queue while queued', async () => {
      await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: 'ranked' })

      const res = await request(app)
        .delete('/matchmaking/leave')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(204)
    })

    test('returns 204 when not in queue (safe to call)', async () => {
      const res = await request(app)
        .delete('/matchmaking/leave')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(204)
    })

    test('returns 401 without auth token', async () => {
      const res = await request(app).delete('/matchmaking/leave')
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('GET /matchmaking/status', () => {
    test('returns 200 with queue entry when user is in queue', async () => {
      await request(app)
        .post('/matchmaking/join')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ game_mode: 'ranked' })

      const res = await request(app)
        .get('/matchmaking/status')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('queue_id')
      expect(res.body).toHaveProperty('game_mode', 'ranked')
      expect(res.body).toHaveProperty('elo_rating')
      expect(res.body).toHaveProperty('joined_at')
    })

    test('returns 404 when user is not in queue', async () => {
      const res = await request(app)
        .get('/matchmaking/status')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })

    test('returns 401 without auth token', async () => {
      const res = await request(app).get('/matchmaking/status')
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })
  })
})
