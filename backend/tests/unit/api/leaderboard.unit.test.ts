import { describe, test, expect } from 'vitest';

import { request, app, expectEmptyArray, expectShape, paginationValidationTests, idValidationTests } from '../helpers/test-utils'

describe('Leaderboard API', () => {
  describe('GET /api/elo/leaderboard', () => {
    test('returns 200 with array of leaderboard entries', async () => {
      const response = await request(app).get('/api/elo/leaderboard');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      
    })

    test('returns entries with rank, username and rating', async () => {
      const response = await request(app).get('/api/elo/leaderboard');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('rank');
        expect(response.body.data[0]).toHaveProperty('username');
        expect(response.body.data[0]).toHaveProperty('rating');
      }
    });

    test('returns limit query parameter', async () => {
      const response = await request(app).get('/api/elo/leaderboard?limit=5');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    test('entries are sorted by rating desc', async () => {
      const response = await request(app).get('/api/elo/leaderboard');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      for (let i = 1; i < response.body.data.length; i++) {
        expect(response.body.data[i].rating).toBeLessThanOrEqual(response.body.data[i - 1].rating);
      }
    });
  })
})