import request from 'supertest'
import app from '../../src/app'

describe('Users API', () => {
  describe('GET /users/:user_id', () => {
    test('returns 200 with full user profile for valid id', async () => {
      const res = await request(app).get('/users/42')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        user_id: 42,
        username: 'striker99',
        email: 'user@example.com',
        created_at: '2025-01-15T08:30:00Z',
      })
    })

    test('returns 404 for non-existent user', async () => {
      const res = await request(app).get('/users/99999')
      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })

    test('returns 400 for non-integer user_id', async () => {
      const res = await request(app).get('/users/abc')
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('PUT /users/:user_id', () => {
    const validBody = { username: 'striker_v2', email: 'new@example.com' }

    test('returns 200 and updated profile when self-updating with auth', async () => {
      const res = await request(app)
        .put('/users/42')
        .set('Authorization', 'Bearer valid-jwt')
        .send(validBody)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        user_id: 42,
        username: 'striker_v2',
        email: 'new@example.com',
        created_at: '2025-01-15T08:30:00Z',
      })
    })

    test('returns 200 with partial update (single field)', async () => {
      const res = await request(app)
        .put('/users/42')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ username: 'new_name_only' })
      expect(res.status).toBe(200)
      expect(res.body.username).toBe('new_name_only')
      expect(res.body.email).toBeDefined()
    })

    test('returns 401 when no auth token provided', async () => {
      const res = await request(app).put('/users/42').send(validBody)
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    test('returns 403 when updating a different user', async () => {
      const res = await request(app)
        .put('/users/1')
        .set('Authorization', 'Bearer valid-jwt')
        .send(validBody)
      expect(res.status).toBe(403)
      expect(res.body.error.code).toBe('FORBIDDEN')
    })

    test('returns 400 for invalid email format', async () => {
      const res = await request(app)
        .put('/users/42')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ email: 'not-an-email' })
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    test('returns 400 for empty username', async () => {
      const res = await request(app)
        .put('/users/42')
        .set('Authorization', 'Bearer valid-jwt')
        .send({ username: '' })
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    test('returns 404 when user does not exist', async () => {
      const res = await request(app)
        .put('/users/99999')
        .set('Authorization', 'Bearer valid-jwt')
        .send(validBody)
      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })
  })

  describe('DELETE /users/:user_id', () => {
    test('returns 204 when authorized user deletes own account', async () => {
      const res = await request(app)
        .delete('/users/42')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(204)
    })

    test('returns 401 without auth token', async () => {
      const res = await request(app).delete('/users/42')
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    test('returns 403 when deleting another user', async () => {
      const res = await request(app)
        .delete('/users/1')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(403)
      expect(res.body.error.code).toBe('FORBIDDEN')
    })

    test('returns 404 for non-existent user', async () => {
      const res = await request(app)
        .delete('/users/99999')
        .set('Authorization', 'Bearer valid-jwt')
      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })
  })
})
