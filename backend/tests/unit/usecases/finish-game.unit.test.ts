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

        
    });
});