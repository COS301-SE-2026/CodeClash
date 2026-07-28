import { vi, Mock, describe, beforeEach, it, expect} from 'vitest';
import { getMatchResults } from '../../../src/interface-adapters/controllers/match-results.controllers';
import { Response, Request } from 'express';

const mockReq = (override: Partial<Request> = {}): Request => ({ params: {}, body: {}, query: {}, ...override } as unknown as Request);

const mockRes = (): Response => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

vi.mock('src/application/usecases/services/match-result.service', () => ({
    MatchResultService: vi.fn().mockImplementation(() => ({ getMatchResult: vi.fn(),})),
}));

describe('getMatchResults controller', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns 200 with match result', async () => {
        const mockResult = {
            match_id: 'match-uuid',
            players: [
                { user_id: 'winner-uuid', username: 'alice', avatar: '1', correctness: 80, speed: '02:30', eloEffect: 16, position: 1 },
                { user_id: 'loser-uuid', username: 'bob', avatar: '2', correctness: 60, speed: '03:10', eloEffect: -16, position: 2 },
            ]   
        };

        const req = mockReq({ params: { match_id: 'match-uuid' } });
        const res = mockRes();

        const { MatchResultService } = await import('../../../src/application/usecases/services/match-result.service');
        const instance= new MatchResultService({} as any, {} as any);
        (instance.getMatchResult as Mock).mockResolvedValueOnce(mockResult);

        await getMatchResults(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('returns 400 if match_id is missing', async () => {
        const req = mockReq({ params: {} });
        const res = mockRes();

        await getMatchResults(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'match ID is required'});
    });

    it('returns 404 if service throws', async () => {
        const req = mockReq({ params: { match_id: 'match-uuid' } });
        const res = mockRes();

        const { MatchResultService } = await import('../../../src/application/usecases/services/match-result.service');
        const instance= new MatchResultService({} as any, {} as any);
        (instance.getMatchResult as Mock).mockRejectedValueOnce(new Error('Results not ready'));

        await getMatchResults(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Results not ready' });
    });
});