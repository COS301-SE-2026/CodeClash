import { vi, Mock, describe, beforeEach, it, expect} from 'vitest';
import { MatchResultService } from '../../../../src/application/usecases/services/match-result.service';
import { IEloRepository } from '../../../../src/application/interfaces/repositories/IEloRepository';
import { IMatchResultRepository } from '../../../../src/application/interfaces/repositories/IMatchResultRepository';
import { getMatchResults } from '../../../../src/interface-adapters/controllers/match-results.controllers';
import { Response, Request } from 'express';

// Mocking
const mockEloRepo: IEloRepository = {
    createUserElo: vi.fn(),
    getElo: vi.fn(),
    getUsersElo: vi.fn(),
    updateRatingsAfterMatch: vi.fn(),
};

const mockMatchResultRepo: IMatchResultRepository = {
    saveMatchLog: vi.fn(),
    getUserDetails: vi.fn(),
    buildMatchResult: vi.fn(),
};

describe('MatchResultService', () => {
    let service: MatchResultService;

    beforeEach(() =>{
        vi.clearAllMocks();
        service = new MatchResultService(mockEloRepo, mockMatchResultRepo);
    });

    describe('finaliseMatch', () => {
        const playerStats = [
            { user_id: 'winner-uuid', correctness: 80, speed: '02:30' },
            { user_id: 'loser-uuid', correctness: 60, speed: '03:10' },
        ];

        it('updates elo and saves match log for ranked match', async () => {
            (mockEloRepo.updateRatingsAfterMatch as Mock).mockResolvedValueOnce({
                winner: { user_id: 'winner-uuid', old_rating: 600, new_rating: 616, elo_gained: 16 },
                loser: { user_id: 'loser-uuid', old_rating: 600, new_rating: 584, elo_gained: -16 },
            });
            (mockMatchResultRepo.saveMatchLog as Mock).mockResolvedValueOnce(undefined);
            (mockMatchResultRepo.getUserDetails as Mock).mockResolvedValueOnce({ username: 'alice', avatar: '1'})
            .mockResolvedValueOnce({ username: 'bob', avatar: '2' });

            const result = await service.finaliseMatch( 'match-uuid', 'winner-uuid', 'loser-uuid', true, playerStats );

            expect(mockEloRepo.updateRatingsAfterMatch).toHaveBeenCalledWith( 'match-uuid', 'winner-uuid', 'loser-uuid' );
            expect(mockMatchResultRepo.saveMatchLog).toHaveBeenCalledWith( 'match-uuid', 'winner-uuid', 'loser-uuid', 16, 16 );
            expect(result.players[0].eloEffect).toBe(16);
            expect(result.players[1].eloEffect).toBe(-16);
        });

        it('skips elo update and saves match log with nulls for casual match', async () => {
            (mockMatchResultRepo.saveMatchLog as Mock).mockResolvedValueOnce(undefined);
            (mockMatchResultRepo.getUserDetails as Mock).mockResolvedValueOnce({ username: 'alice', avatar: '1'})
            .mockResolvedValueOnce({ username: 'bob', avatar: '2' });

            const result = await service.finaliseMatch( 'match-uuid', 'winner-uuid', 'loser-uuid', false, playerStats );

            expect(mockEloRepo.updateRatingsAfterMatch).not.toHaveBeenCalled( );
            expect(mockMatchResultRepo.saveMatchLog).toHaveBeenCalledWith( 'match-uuid', 'winner-uuid', 'loser-uuid', null, null);
        });

        it('return correct MatchResultDTO shape', async () => {
            (mockMatchResultRepo.saveMatchLog as Mock).mockResolvedValueOnce(undefined);
            (mockMatchResultRepo.getUserDetails as Mock)
            .mockResolvedValueOnce({ username: 'alice', avatar: '1'})
            .mockResolvedValueOnce({ username: 'bob', avatar: '2' });

            const result = await service.finaliseMatch( 'match-uuid', 'winner-uuid', 'loser-uuid', false, playerStats );

            expect(result.match_id).toBe('match-uuid');
            expect(result.players).toHaveLength(2);
            expect(result.players[0].position).toBe(1);
            expect(result.players[1].position).toBe(2);
            expect(result.players[0].username).toBe('alice');
            expect(result.players[0].correctness).toBe(80);
            expect(result.players[0].speed).toBe('02:30');
        });

        it('sorts players so winner is position 1', async () => {
            (mockMatchResultRepo.saveMatchLog as Mock).mockResolvedValueOnce(undefined);
            //deliberately paass loser first
            const reservedStats = [
                { user_id: 'loser-uuid', correctness: 60, speed: '03:10'},
                { user_id: 'winner-uuid', correctness: 80, speed: '02:30'},
            ];
            (mockMatchResultRepo.getUserDetails as Mock).mockResolvedValueOnce({ username: 'bob', avatar: '2'}).
            mockResolvedValueOnce({ username: 'alice', avatar: '1'});

            const result = await service.finaliseMatch(
                'match-uuid', 'winner-uuid', 'loser-uuid',false, reservedStats
            );

            expect(result.players[0].user_id).toBe('winner-uuid');
            expect(result.players[0].position).toBe(1);
            expect(result.players[1].user_id).toBe('loser-uuid');
            expect(result.players[1].position).toBe(2);
        });

        it('throws if getUserDetails fails', async () => {
            (mockMatchResultRepo.saveMatchLog as Mock).mockResolvedValueOnce(undefined);
            (mockMatchResultRepo.getUserDetails as Mock).mockRejectedValueOnce(new Error('User not found'));

            await expect (
                service.finaliseMatch('match-uuid', 'winner-uuid', 'loser-uuid', false, playerStats)
            ).rejects.toThrow('User not found');
        });
    });

    describe('getMatchResult', () => {
        it('calls buildMatchResult with match_id', async () => {
            const mockResult = {
                match_id: 'match-uuid',
                players: []
            };
            (mockMatchResultRepo.buildMatchResult as Mock).mockResolvedValueOnce(mockResult);

            const result =await service.getMatchResult('match-uuid');

            expect(mockMatchResultRepo.buildMatchResult).toHaveBeenCalledWith('match-uuid');
            expect(result).toEqual(mockResult);
        });

        it('throws if buildMatchResult throws', async () => {
            (mockMatchResultRepo.buildMatchResult as Mock).mockRejectedValueOnce( new Error('Match log not found'));

            await expect(service.getMatchResult('match-uuid')).rejects.toThrow('Match log not found');
        });
    });
});