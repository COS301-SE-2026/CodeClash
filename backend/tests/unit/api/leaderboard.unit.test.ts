import { describe, test, expect } from 'vitest';

import { request, app, expectEmptyArray, expectShape, paginationValidationTests, idValidationTests } from '../helpers/test-utils'

describe('Leaderboard API', () => {
  describe('GET /api/elo/leaderboard', () => {
    test('returns 200 with array of leaderboard entries', async () => {
      const response = await request(app).get('/api/elo/leaderboard');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
    })

    test('returns entries with rank, username and rating', async () => {
      const response = await request(app).get('/api/elo/leaderboard');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('rank');
        expect(response.body[0]).toHaveProperty('username');
        expect(response.body[0]).toHaveProperty('rating');
      }
    });
  })
})