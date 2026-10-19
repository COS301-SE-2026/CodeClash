import { MatchCompletionService } from '../../../../src/application/usecases/services/match/match-completion.service'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { randomUUID } from 'crypto'
import { MatchType } from '../../../../src/entities/dtos/matches/match.dto'

let match_repo: any, completion_system: any, user_repo: any, achievement_service: any, reward_service: any, wallet_repo: any;

let service: MatchCompletionService;


describe('Tests match completion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        completion_system = {
            execute: vi.fn((ecs_id: number, player_ids: string[], times: Map<string, number>) => {
                return {
                    players: [
                        { id: 'winner', position: 1 },
                        { id: 'loser', position: 2 }
                    ],
                    match_stats: new Map([
                        ['winner', {}],
                        ['loser', {}]
                    ]),
                    total_questions: 10
                }
            })
        }

        user_repo = {
            updateEloAfterMatch: vi.fn(async (winner: string, loser: string) => {
                return {
                    winner: {
                        user_id: 'winner',
                        old_rating: 600,
                        new_rating: 616,
                        elo_gained: 16
                    },
                    loser: {
                        user_id: 'loser',
                        old_rating: 600,
                        new_rating: 584,
                        elo_gained: -16
                    }
                }
            }),

            updateEloAfterTournament: vi.fn(async (result: { user_id: string, placement: number }) => {
                return [];
            })
        }

        reward_service = {
            calculateReward: vi.fn(() => { return 0 })
        }

        wallet_repo = {
            getWallet: vi.fn(),
            createWallet: vi.fn(),
            updateBalance: vi.fn()
        }

        achievement_service = {
            evaluateForMatch: vi.fn()
        }

        match_repo = {
            updatePlayers: vi.fn(),
            completeMatch: vi.fn(),
            buildMatchResult: vi.fn(),
        }

        service = new MatchCompletionService(match_repo, completion_system, user_repo, achievement_service, reward_service, wallet_repo);
    }
    )

    it('Updates elo correctly for different match types', async () => {
        await service.execute(1, randomUUID(), ['winner', 'loser'], MatchType.ranked);
        expect(user_repo.updateEloAfterMatch).toHaveBeenCalledWith('winner', 'loser');

        await service.execute(1, randomUUID(), ['winner', 'loser'], MatchType.tournament);
        expect(user_repo.updateEloAfterTournament).toHaveBeenCalledWith(
            [
                { user_id: 'winner', placement: 1 },
                { user_id: 'loser', placement: 2 }
            ]
        )


    })

    it("Doesn't update elo for casual matches", async () => {
        await service.execute(1, randomUUID(), ['winner', 'loser'], MatchType.casual);
        expect(user_repo.updateEloAfterMatch).not.toHaveBeenCalled();
        expect(user_repo.updateEloAfterTournament).not.toHaveBeenCalled();
    })

    it("creates a wallet if a user doesn't have one", async () => {
        wallet_repo.getWallet.mockResolvedValue(null);

        await service.execute(1, randomUUID(), ['winner', 'loser'], MatchType.tournament);

        expect(wallet_repo.createWallet).toHaveBeenCalledTimes(2);
        expect(wallet_repo.createWallet).toHaveBeenCalledWith('winner');
        expect(wallet_repo.createWallet).toHaveBeenCalledWith('loser');
    })
})
