import request from 'supertest';
import { vi, Mock, describe, beforeEach, it, expect, afterAll } from 'vitest'
import pool from '../../src/config/db';
import app from '../../src/app';

vi.mock('../../src/config/db', () => ({
  default: {
    query: vi.fn(),
    connect: vi.fn(),
  }
}));

describe('Friend Endpoints', () => {
    beforeEach(() => {
    vi.clearAllMocks();
    });

    afterAll(async () => {
        await pool.end?.();
    });

    describe('GET /api/friends/:user_id', () => {

        it('should return a list of friends for a valid user', async () =>{
            (pool.query as Mock).mockResolvedValueOnce({
                rows: [
                    {
                        user_id: 'friend-uuid-1',
                        username: 'friendone',
                        created_at: new Date(),
                        updated_at: new Date()

                    },
                    {
                        user_id: 'friend-uuid-2',
                        username: 'friendtwo',
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                ]
            });

            const response = await request(app).get('/api/friends/user-uuid');
            
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty('username');

        });

        it('should return an empty array if user has no friends', async () =>{
            (pool.query as Mock).mockResolvedValueOnce({ rows: [] });

            const response = await request(app).get('/api/friends/user-uuid');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal server error');
            
        });
    });
})