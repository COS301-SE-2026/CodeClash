import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinishGame } from '../../../src/application/usecases/systems/finish-game';
import { GameType } from '../../../src/entities/db-entities/questions.entities';
import { Any } from 'typeorm';
import { match } from 'node:assert';

describe('FinishGame', () => {
    let world: any;
    let match_result_service: any;
    let game_store: any;
    let delete_game: any;
    let match_stats_repo: any;
    let finish_game: FinishGame;

    const match_id = 42;
    const player_ids = ['player-a', 'player-b'];
    const pair_id = 'pair-1';
    const db_match_id = 'db-match-uuid';

    beforeEach(() => {
        world = {
            getMatchComponent: vi.fn(),
            getSubmissionComponent: vi.fn(),
            addMatchComponent: vi.fn()
        };

        match_result_service = {
            finaliseMatch: vi.fn()
        };

        game_store = {
            get: vi.fn().mockReturnValue({ database_id: db_match_id})
        }

        delete_game = {
            execute: vi.fn()
        };

        match_stats_repo = {
            saveStats: vi.fn().mockResolvedValue(undefined)
        };

        finish_game = new FinishGame(world, match_result_service, game_store, delete_game,match_stats_repo);
    });

    describe('execute', () => {
        it('throws if the submission registry is missing', async () => {
            world.getMatchComponent.mockReturnValue(null);

            await expect(
                finish_game.execute(match_id, player_ids, GameType.ranked, pair_id)
            ).rejects.toThrow("error finishing game");

            expect(match_stats_repo.saveStats).not.toHaveBeenCalled();
            expect(match_result_service.finaliseMatch).not.toHaveBeenCalled();
        });

        it('persists match stats for both players before determining a winner', async () => {
            const SubmissionRegistry = {
                submission: new Map([
                    ['player-a::q1', 1],
                    ['player-a::q2', 2],
                    ['player-b::q1', 3]
                ])
            };

            world.getMatchComponent.mockReturnValue(SubmissionRegistry);

            const started = new Date('2026-01-01T00:00:00Z');
            const submitted = new Date('2026-01-01T00:00:05Z');

            world.getSubmissionComponent.mockImplementation((entity: number) => {
                const data: Record<number, any> ={
                    1: { correct: true, submitted_at: submitted, started_at: started },
                    2: { correct: true, submitted_at: submitted, started_at: started },
                    3: { correct: false, submitted_at: submitted, started_at: started },
                };
                return data[entity];
            });

            match_result_service.finaliseMatch.mockResolvedValueOnce({
                players: [
                    { user_id: 'player-a', eloEffect: 16 },
                    { user_id: 'player-b', eloEffect: -16 }
                ]
            });

            await finish_game.execute(match_id, player_ids, GameType.ranked, pair_id);

            expect(match_stats_repo.saveStats).toHaveBeenCalledWith(db_match_id, 'player-a', 2, 10000);
            expect(match_stats_repo.saveStats).toHaveBeenCalledWith(db_match_id, 'player-b', 0, 5000);
            expect(match_stats_repo.saveStats).toHaveBeenCalledTimes(2);

        });

        it('determines the winner as the player with more correct answers', async () => {
            world.getMatchComponent.mockReturnValue({
                submissions: new Map([
                    ['player-a::q1', 1],
                    ['player-a::q2', 2],
                    ['player-b::q1', 3]
                ])
            });

            //copied from above
            const started = new Date('2026-01-01T00:00:00Z');
            const submitted = new Date('2026-01-01T00:00:05Z');

            //copied from above
            world.getSubmissionComponent.mockImplementation((entity: number) => {
                const data: Record<number, any> ={
                    1: { correct: true, submitted_at: submitted, started_at: started },
                    2: { correct: true, submitted_at: submitted, started_at: started },
                    3: { correct: false, submitted_at: submitted, started_at: started },
                };
                return data[entity];
            });

            //cpoied from above
            match_result_service.finaliseMatch.mockResolvedValueOnce({
                players: [
                    { user_id: 'player-a', eloEffect: 16 },
                    { user_id: 'player-b', eloEffect: -16 }
                ]
            });

            //copied from above
            await finish_game.execute(match_id, player_ids, GameType.ranked, pair_id);

            expect(match_result_service.finaliseMatch).toHaveBeenCalledWith(
                db_match_id,
                'player-a',
                'player-b',
                true,
                expect.arrayContaining([
                    expect.objectContaining({ user_id: 'player-a', correctness: 2}),
                    expect.objectContaining({ user_id: 'player-b', correctness: 0})
                ])
            );
        });

        
    });
});