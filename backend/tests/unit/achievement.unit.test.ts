import { request, app, expectNotFound, expectValidationError, expectEmptyArray, expectArrayResponse, expectPaginated, expectShape, paginationValidationTests, userSubResourceTests } from '../helpers/test-utils'

const achievementProps = ['achievement_id', 'name', 'description', 'condition']

describe('Achievements API', () => {
  describe('GET /achievements', () => {
    test('returns 200 with full achievement catalog', async () => {
      const res = await request(app).get('/achievements')
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThanOrEqual(1)
      res.body.forEach((a: any) => expectShape(a, achievementProps))
    })

    test('includes "First Blood" achievement in catalog', async () => {
      const res = await request(app).get('/achievements')
      expect(res.status).toBe(200)
      expect(res.body.map((a: any) => a.name)).toContain('First Blood')
    })

    paginationValidationTests('/achievements')
  })

  describe('GET /achievements/:achievement_id', () => {
    test('returns 200 with achievement details', async () => {
      const res = await request(app).get('/achievements/1')
      expect(res.status).toBe(200)
      expectShape(res.body, achievementProps)
      expect(res.body.achievement_id).toBe(1)
    })

    test('returns 404 for non-existent achievement', async () => {
      expectNotFound(await request(app).get('/achievements/999'))
    })

    test('returns 400 for non-integer achievement_id', async () => {
      expectValidationError(await request(app).get('/achievements/abc'))
    })
  })

  describe('GET /users/:user_id/achievements', () => {
    test('returns 200 with user achievements including nested achievement data', async () => {
      const res = await request(app).get('/users/42/achievements')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((ua: any) => {
        expectShape(ua, ['user_achievement_id', 'user_id', 'achievement_id', 'unlocked_at'])
        expect(ua).toHaveProperty('achievement')
        expect(ua.user_id).toBe(42)
        expectShape(ua.achievement, ['name', 'description'])
      })
    })

    test('includes "First Blood" with unlock timestamp for user who has it', async () => {
      const res = await request(app).get('/users/42/achievements')
      const firstBlood = res.body.find(
        (ua: any) => ua.achievement.name === 'First Blood'
      )
      expect(firstBlood).toBeDefined()
      expect(firstBlood.unlocked_at).toBeDefined()
    })

    test('returns 200 with empty array for user with no achievements', async () => {
      expectEmptyArray(await request(app).get('/users/1/achievements'))
    })

    test('returns 404 for non-existent user', async () => {
      expectNotFound(await request(app).get('/users/99999/achievements'))
    })

    test('returns 400 for invalid user_id', async () => {
      expectValidationError(await request(app).get('/users/abc/achievements'))
    })
  })
})
