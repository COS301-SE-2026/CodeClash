import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/config/db';

// Mock the database so tests don't need a real PostgreSQL connection
jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

describe('Elo Endpoints', () => {

  // Reseting mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Close pool after all tests finish
  afterAll(async () => {
    await pool.end?.();
  });

  // GET /api/elo/:user_id ---------
  describe('GET /api/elo/:user_id', () => {

    it('should return elo rating for a valid user', async () => {
      // Arrange: mock what the database would return
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          elo_id: 'some-uuid',
          user_id: 'user-uuid',
          username: 'testuser',
          rating: 600,
          updated_at: new Date()
        }]
      });

      // Act: make the request
      const response = await request(app)
        .get('/api/elo/user-uuid');

      // Assert: check the response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('rating');
      expect(response.body.rating).toBe(600);
    });

    it('should return 404 if user has no elo rating', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/elo/nonexistent-uuid');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Elo rating not found for this user');
    });

    it('should return 500 if database throws an error', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      const response = await request(app)
        .get('/api/elo/user-uuid');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Internal server error');
    });

  });

  
  // GET /api/elo/:user_id/history -----------
  describe('GET /api/elo/:user_id/history', () => {

    it('should return elo history for a valid user', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            history_id: 'history-uuid',
            user_id: 'user-uuid',
            match_id: 'match-uuid',
            old_rating: 600,
            new_rating: 616,
            change: 16,
            changed_at: new Date()
          }
        ]
      });

      const response = await request(app)
        .get('/api/elo/user-uuid/history');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('old_rating');
      expect(response.body[0]).toHaveProperty('new_rating');
    });

    it('should return 404 if no history found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/elo/user-uuid/history');

      expect(response.status).toBe(404);
    });

  });

  // POST /api/elo/update
  describe('POST /api/elo/update', () => {

    it('should update elo ratings after a ranked match', async () => {
      // connect() returns a client with query, release
      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };

      (pool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

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
        query: jest.fn(),
        release: jest.fn(),
      };

      (pool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

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
        query: jest.fn(),
        release: jest.fn(),
      };

      (pool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

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
      (pool.query as jest.Mock).mockResolvedValueOnce({
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
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      const response = await request(app)
        .get('/api/elo/leaderboard');

      expect(response.status).toBe(500);
    });

  });

});