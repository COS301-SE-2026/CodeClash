/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { MatchCompletionService } from '../../../src/application/usecases/services/match/match-completion.service';
import { RewardService } from '../../../src/application/usecases/services/match/reward.service';
import { MatchType } from '../../../src/entities/dtos/matches/match.dto';

const make = (pct = 0) => {
    const players: any[] = [{ id: 'a', position: 1, elo_change: 0 }, { id: 'b', position: 2, elo_change: 0 }];
    const s = { num_correct: 3, total_time: 1000, num_answered: 3 };
    const d = {
        match_repo: {
            updatePlayers: vi.fn(), completeMatch: vi.fn(),
            buildMatchResult: vi.fn(async () => ({ match_id: 'm', players: [{ user_id: 'a' }, { user_id: 'b' }] })),
            getMatchHistory: vi.fn(async () => ['h']), getSkillProgress: vi.fn(async () => ['s']),
        },
        completion_system: { execute: vi.fn(async () => ({ players, match_stats: new Map([['a', s], ['b', s]]), total_questions: 3 })) },
        user_repo: {
            updateEloAfterMatch: vi.fn(async () => ({ winner: { elo_gained: 10 }, loser: { elo_gained: -10 } })),
            updateEloAfterTournament: vi.fn(async () => [{ user_id: 'a', elo_gained: 5 }]),
        },
        achievement_service: { evaluateForMatch: vi.fn() },
        wallet_repo: { getWallet: vi.fn(async () => null), createWallet: vi.fn(), updateBalance: vi.fn() },
        powerup_system: { getScoreMultiplierPercent: vi.fn(() => pct) },
    };
    const svc = new MatchCompletionService(d.match_repo as any, d.completion_system as any, d.user_repo as any,
        d.achievement_service as any, new RewardService(), d.wallet_repo as any, d.powerup_system as any);
    return { svc, d, players };
};

describe('MatchCompletionService', () => {
    it('ranked: updates elo, pays rewards, evaluates achievements', async () => {
        const { svc, d, players } = make();
        const res = await svc.execute(1, 'db', ['a', 'b'], MatchType.ranked, undefined, 'math' as never);
        expect(players[0].elo_change).toBe(10);
        expect(players[1].elo_change).toBe(-10);
        expect(d.wallet_repo.createWallet).toHaveBeenCalledTimes(2);
        expect(res.players[0]!.reward).toBeGreaterThan(res.players[1]!.reward);
        expect(d.achievement_service.evaluateForMatch).toHaveBeenCalledWith(expect.anything(), players, MatchType.ranked, 3, 'math');
        expect(d.match_repo.completeMatch).toHaveBeenCalled();
    });

    it('tournament uses placements', async () => {
        const { svc, d, players } = make();
        await svc.execute(1, 'db', ['a', 'b'], MatchType.tournament);
        expect(d.user_repo.updateEloAfterTournament).toHaveBeenCalled();
        expect(players[0].elo_change).toBe(5);
    });

    it('score multiplier boosts pay', async () => {
        const base = await make(0).svc.execute(1, 'db', ['a', 'b'], MatchType.casual);
        const boosted = await make(100).svc.execute(1, 'db', ['a', 'b'], MatchType.casual);
        expect(boosted.players[0]!.reward).toBe(base.players[0]!.reward * 2);
    });

    it('achievement failure does not block completion', async () => {
        const { svc, d } = make();
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        d.achievement_service.evaluateForMatch.mockRejectedValueOnce(new Error('boom'));
        await expect(svc.execute(1, 'db', ['a', 'b'], MatchType.casual)).resolves.toBeDefined();
        expect(err).toHaveBeenCalled();
        err.mockRestore();
    });

    it('passthrough getters', async () => {
        const { svc } = make();
        expect(await svc.getMatchResults('m')).toBeDefined();
        expect(await svc.getMatchHistory('u')).toEqual(['h']);
        expect(await svc.getSkillProgress('u')).toEqual(['s']);
    });
});