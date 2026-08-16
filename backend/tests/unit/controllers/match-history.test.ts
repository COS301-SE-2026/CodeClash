import { it, Mock, describe, expect, vi, beforeEach, expectTypeOf } from "vitest";
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
            mockRepo.getMatchHistory.mockResolvedValueOnce([]);

            req.user.id = 'authenticated-user-uuid';
            req.param = { user_id: 'some-other-user-uuid' };

            const handler = getMatchHistory(mockRepo);
            await handler(req, res);

            expect(mockRepo.getMatchHistory).toHaveBeenCalledWith('authenticated-user-uuid');
            expect(mockRepo.getMatchHistory).not.toHaveBeenCalledWith('some-other-user-uuid');
        });
    });

    describe('getMatchDetails', () => {
        it('returns 200 with match details for a valid match_id', async () => {
            const mockDetails = {
                match_id: 'match-1',
                mode: 'ranked',
                game_type: 'math',
                match_start: new Date(),
                result: 'WIN',
                score: '3-2',
                quesitons: [{ label: 'QUESTION 1', correctness: true }],
                totalTime: '00:45'
            };

            req.params = { match_id: 'match-1' };
            mockRepo.getMatchDetails.mockResolvedValueOnce(mockDetails);

            const handler = getMatchDetails(mockRepo);
            await handler(req, res);

            expect(mockRepo.getMatchDetails).toHaveBeenCalledWith('match-1', 'user-1');
            expect(res.status).toHaveBeenNthCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockDetails);
        });

        it('returns 400 if match_id is missing from the params', async () => {
            req.params = {};

            const handler = getMatchDetails(mockRepo);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'match ID is required' });
            expect(mockRepo.getMatchDetails).not.toHaveBeenCalled();
        });

        it('returns 404 if the repository throws (e.g. match not found)', async () => {
            req.params = { match_id: 'nonexistent-match' };
            mockRepo.getMatchDetails.mockRejectedValueOnce(new Error('Match nonexistent-match not found'));

            const handler = getMatchDetails(mockRepo);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Match not found' });
        });

        it('passes both match_id and the authenticated user_id to the repository', async () => {

        });
    });
});