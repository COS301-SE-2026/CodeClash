import { vi, Mock, describe, beforeEach, it, expect, afterAll, afterEach } from 'vitest'
import request from 'supertest';
import app from '../../src/app';
import { pool } from '../../src/config/db';
import { getToken, login, logout } from 'test/test-utils';
import { JWT } from '@aws-amplify/auth';
import '../../src/config/amplify-config'


describe('Elo Endpoints', () => {
  // Reseting before each test

  let token: JWT | undefined;
  // Close pool after all tests finish
  afterAll(async () => {

  });

  // GET /api/elo/elo-get ---------
  describe('GET /api/elo/elo-get', () => {

    beforeEach(async () => {
      await login();
      token = await getToken();
    });


    afterEach(async () => {
      await logout();
    })

    it('should return elo rating for a valid user', async () => {
      // Act: make the request
      try {
        const response = await request(app)
          .get('/api/elo/elo-get')
          .set('Authorization', `Bearer ${token}`);


        // Assert: check the response
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('rating');
        expect(response.body.rating).toBe(600);
      } catch (err) {
        console.log("Error: ", err);
        throw err;
      }

    });

    it('should return unauthorised for invalid user', async () => {

      try {
        const response = await request(app)
          .get('/api/elo/elo-get')
          .set('Authorization', 'Bearer "This is an invalid token"')

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('Unauthorised: Missing or Invalid Token')

      } catch (err) {
        console.log("Error: ", err);
        throw err;
      }
    })

  });


  // GET /api/elo/elo-history -----------
  describe('GET /api/elo/:user_id/history', () => {

    it('should return elo history for a valid user', async () => {


      const response = await request(app)
        .get('/api/elo/elo-history')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);

      console.log(response.body)
    });

    it('should return 404 if no history found', async () => {

      const response = await request(app)
        .get('/api/elo/elo-history')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

  });

  // POST /api/elo/update
  describe('POST /api/elo/update', () => {

    it('should update elo ratings after a ranked match', async () => {
      // connect() returns a client with query, release
      const mockClient = {
        query: vi.fn(),
        release: vi.fn(),
      };

      (pool.connect as Mock).mockResolvedValueOnce(mockClient);

      // Mock each query in order:
      // 1. BEGIN
      // 2. Check match exists
      // 3. Get winner elo
      // 4. Get loser elo
      // 5. Update winner elo
      // 6. Update loser elo
      // 7. Insert winner history
      // 8. Insert loser history
      // 9. Insert match log
      // 10. COMMIT
      mockClient.query
        .mockResolvedValueOnce({})                                          // BEGIN
        .mockResolvedValueOnce({ rows: [{ mode: 'ranked' }] })             // match check
        .mockResolvedValueOnce({ rows: [{ rating: 600 }] })                // winner elo
        .mockResolvedValueOnce({ rows: [{ rating: 600 }] })                // loser elo
        .mockResolvedValueOnce({})                                          // update winner
        .mockResolvedValueOnce({})                                          // update loser
        .mockResolvedValueOnce({})                                          // winner history
        .mockResolvedValueOnce({})                                          // loser history
        .mockResolvedValueOnce({})                                          // match log
        .mockResolvedValueOnce({});                                         // COMMIT

      const response = await request(app)
        .post('/api/elo/update')
        .send({
          match_id: 'match-uuid',
          winner_id: 'winner-uuid',
          loser_id: 'loser-uuid'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('winner');
      expect(response.body).toHaveProperty('loser');
      expect(response.body.winner).toHaveProperty('elo_gained');
      expect(response.body.loser).toHaveProperty('elo_lost');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/elo/update')
        .send({ match_id: 'match-uuid' }); // missing winner_id and loser_id

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if match is casual not ranked', async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn(),
      };

      (pool.connect as Mock).mockResolvedValueOnce(mockClient);

      mockClient.query
        .mockResolvedValueOnce({})                                         // BEGIN
        .mockResolvedValueOnce({ rows: [{ mode: 'casual' }] });           // match is casual

      const response = await request(app)
        .post('/api/elo/update')
        .send({
          match_id: 'match-uuid',
          winner_id: 'winner-uuid',
          loser_id: 'loser-uuid'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Elo is only updated for ranked matches');
    });

    it('should return 500 and rollback if database throws', async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn(),
      };

      (pool.connect as Mock).mockResolvedValueOnce(mockClient);

      mockClient.query
        .mockResolvedValueOnce({})                                         // BEGIN
        .mockRejectedValueOnce(new Error('DB error'));                     // match check fails

      const response = await request(app)
        .post('/api/elo/update')
        .send({
          match_id: 'match-uuid',
          winner_id: 'winner-uuid',
          loser_id: 'loser-uuid'
        });

      expect(response.status).toBe(500);
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });

  });

  // GET /api/elo/leaderboard ---------------
  describe('GET /api/elo/leaderboard', () => {

    it('should return top 10 players', async () => {
      (pool.query as Mock).mockResolvedValueOnce({
        rows: Array(10).fill({
          user_id: 'some-uuid',
          username: 'testuser',
          rating: 800,
          rank: 1
        })
      });

      const response = await request(app)
        .get('/api/elo/leaderboard');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(10);
    });

    it('should return 500 if database throws', async () => {
      (pool.query as Mock).mockRejectedValueOnce(new Error('DB error'));

      const response = await request(app)
        .get('/api/elo/leaderboard');

      expect(response.status).toBe(500);
    });

  });

});