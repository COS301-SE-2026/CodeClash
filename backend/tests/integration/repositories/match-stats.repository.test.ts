import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatchStatsRepository } from '../../../src/interface-adapters/repositories/match-stats.repository';

describe('MatchStatsRepository', () => {
    let mockRepo: any;
    let repository: MatchStatsRepository;

    beforeEach(() => {
        mockRepo ={
            create: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
            findOne: vi.fn()
        };
        repository = new MatchStatsRepository(mockRepo);
    });

    describe('saveStats', () =>{
        it('creates and saves a match stats record with correct fields', async () =>{
            const created = { match: { match_id: 'match-1' }, user: { user_id: 'user-1' }, num_correct: 4, total_time: 12000 };
            mockRepo.create.mockReturnValueOnce(created);
            mockRepo.save.mockResolvedValueOnce(created);

            await repository.saveStats('match-1', 'user-1', 4, 12000);

            expect(mockRepo.create).toHaveBeenCalledWith({
                match: { match_id: 'match-1' },
                user: { user_id: 'user-1' },
                num_correct: 4,
                total_time: 12000
            });
            expect(mockRepo.save).toHaveBeenCalledWith(created);
        });
    });

    describe('getStatsByMatch', () => {
        it('returns stats for both players in a match', async () => {

        });

        it('returns an ampty array when no stats exist for the match', async () => {

        });
    });

    describe('getStatsByMatchAndUser', () => {
        it('returns stats for a specific player in a match', async () => {

        });

        it('returns null when nostats exist for that player/match combination', async () => {

        });
    });
});