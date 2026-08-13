import { it, Mock, describe, expect, vi, beforeEach } from "vitest";
import { getMatchHistory, getMatchDetails } from '../../../src/interface-adapters/controllers/match-history.controllers';

describe('match-history controllers', () => {
    let mockRepo: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockRepo = {
            getMatchHistory: vi.fn(),
            getMatchDetails: vi.fn()
        };

        req = {
            user: { id: 'user-1'},
            params: {}
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
    });

    describe('getMatchHistory', () => {
        it('returns 200 with the user\'s match  history', async () => {
            const mockMatches = [
                { match_id: 'match-1', mode: 'ranked', game_type: 'math', match_start: new Date(), result: 'WIN', score: '3-2' }
            ];

            mockRepo.getMatchHistory.mockResolvedValueOnce(mockMatches);

            const handler = getMatchHistory(mockRepo);
            await handler(req, res);

            expect(mockRepo.getMatchHistory).toHaveBeenCalledWith('user-1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMatches);
        });

        it('returns 200 with an empty array when the user has no matches', async () => {
            mockRepo.getMatchHistory.mockResolvedValueOnce([]);

            const handler = getMatchHistory(mockRepo);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('returns 500 if the repository throws', async () => {
            mockRepo.getMatchHistory.mockRejectedValueOnce(new Error('DB error'));

            const handler = getMatchHistory(mockRepo);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });

        it('always scopes the query to the authenticated user, not a URL param', async () => {
            
        });


    });

    describe('getMatchDetails', () => {
        it('returns 200 with match details for a valid match_id', async () => {

        });

        it('returns 400 if match_id is missing from the params', async () => {

        });

        it('returns 404 if the repository throws (e.g. match not found)', async () => {

        });

        it('passes both match_id and the authenticated user_id to the repository', async () => {

        });
    });
});