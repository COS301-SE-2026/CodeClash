import { request, app, userAuth, expectNotFound, expectValidationError, expectUnauthorized, expectArrayResponse } from '../helpers/test-utils'

const queueProps = ['queue_id', 'user_id', 'game_mode', 'joined_at', 'status']

describe('Matchmaking API', () => {
  describe('GET /matchmaking/queue', () => {
    test('returns 200 with current queue', async () => {
      const res = await request(app).get('/matchmaking/queue')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((entry: any) => expect(entry).toHaveProperty('user_id'))
    })

    test('returns 200 with status filter', async () => {
      const res = await request(app).get('/matchmaking/queue?status=waiting')
      expect(res.status).toBe(200)
      res.body.forEach((entry: any) => {
        expect(entry.status).toBe('waiting')
      })
    })

    test('returns 200 with game_mode filter', async () => {
      const res = await request(app).get('/matchmaking/queue?game_mode=blitz')
      expect(res.status).toBe(200)
      res.body.forEach((entry: any) => {
        expect(entry.game_mode).toBe('blitz')
      })
    })

    test('returns 200 with empty array for unknown game_mode', async () => {
      const res = await request(app).get('/matchmaking/queue?game_mode=unknown')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    test('returns 200 with combined filters', async () => {
      const res = await request(app).get('/matchmaking/queue?status=waiting&game_mode=blitz')
      expect(res.status).toBe(200)
      res.body.forEach((entry: any) => {
        expect(entry.status).toBe('waiting')
        expect(entry.game_mode).toBe('blitz')
      })
    })
  })

  describe('POST /matchmaking/join', () => {
    test('returns 201 when user joins queue', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', userAuth)
        .send({ game_mode: 'blitz' })
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('queue_id')
      expect(res.body.status).toBe('waiting')
      expect(res.body.user_id).toBe(42)
    })

    test('returns 201 with optional elo_range filter', async () => {
      const res = await request(app)
        .post('/matchmaking/join')
        .set('Authorization', userAuth)
        .send({ game_mode: 'ranked', elo_range: { min: 1300, max: 1600 } })
      expect(res.status).toBe(201)
      expect(res.body.game_mode).toBe('ranked')
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(
        await request(app).post('/matchmaking/join').send({ game_mode: 'blitz' })
      )
    })

    test('returns 400 for missing game_mode', async () => {
      expectValidationError(
        await request(app).post('/matchmaking/join').set('Authorization', userAuth).send({})
      )
    })

    test('returns 400 for empty game_mode', async () => {
      expectValidationError(
        await request(app)
          .post('/matchmaking/join')
          .set('Authorization', userAuth)
          .send({ game_mode: '' })
      )
    })
  })

  describe('DELETE /matchmaking/cancel', () => {
    test('returns 204 when user cancels queue', async () => {
      const res = await request(app)
        .delete('/matchmaking/cancel')
        .set('Authorization', userAuth)
      expect(res.status).toBe(204)
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(await request(app).delete('/matchmaking/cancel'))
    })
  })
})
