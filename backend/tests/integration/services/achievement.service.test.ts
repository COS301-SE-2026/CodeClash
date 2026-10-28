/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { AchievementService } from '../../../src/application/usecases/services/achievement.service';
import { MatchType } from '../../../src/entities/dtos/matches/match.dto';

const setup = (streak = 0) => {
    const awarded: string[] = [];
    const repo: any = {
        getAllAchievements: vi.fn(async () => []),
        getUserAchievements: vi.fn(async () => []),
        getAchievementByName: vi.fn(async (name: string) => ({ achievement_id: name, achievement_name: name, description: '' })),
        hasAchievement: vi.fn(async () => false),
        awardAchievement: vi.fn(async (_u: string, id: string) => { awarded.push(id); }),
    };
    const user: any = {
        updateStreaks: vi.fn(),
        getTotalStats: vi.fn(async () => ({ total_wins: 0, total_matches: 0, winning_streak: streak, league: 'Mercury' })),
    };
    return { svc: new AchievementService(repo, user), repo, user, awarded };
};

const stats = (o: Partial<{ num_correct: number; total_time: number; num_answered: number; min_life: number }> = {}) =>
    new Map([['u1', { num_correct: 0, total_time: 999999, num_answered: 3, min_life: 100, ...o }]]);
const players = (position: number) => [{ id: 'u1', position }] as any;

describe('AchievementService', () => {
    it('proxies list calls', async () => {
        const { svc, repo } = setup();
        await svc.getAllAchievements();
        await svc.getUserAchievements('u1');
        expect(repo.getAllAchievements).toHaveBeenCalled();
        expect(repo.getUserAchievements).toHaveBeenCalledWith('u1');
    });

    it('skips achievements the user already has or that do not exist', async () => {
        const { svc, repo, awarded } = setup();
        repo.hasAchievement.mockResolvedValue(true);
        await svc.evaluateAndAward('u1', { total_wins: 1 } as any);
        expect(awarded).toHaveLength(0);
        repo.getAchievementByName.mockResolvedValue(null);
        await svc.evaluateAndAward('u1', { total_wins: 1 } as any);
        expect(awarded).toHaveLength(0);
    });

    it('ranked win with streak 3 awards On a Roll and First Blood', async () => {
        const { svc, user, awarded } = setup(3);
        await svc.evaluateForMatch(stats(), players(1), MatchType.ranked, 3);
        expect(user.updateStreaks).toHaveBeenCalledWith('u1', true);
        expect(awarded).toContain('On a Roll');
        expect(awarded).toContain('First Blood');
    });

    it('streak of 2 does not award On a Roll', async () => {
        const { svc, awarded } = setup(2);
        await svc.evaluateForMatch(stats(), players(1), MatchType.ranked, 3);
        expect(awarded).not.toContain('On a Roll');
    });

    it('casual match does not touch streaks', async () => {
        const { svc, user, awarded } = setup(5);
        await svc.evaluateForMatch(stats(), players(1), MatchType.casual, 3);
        expect(user.updateStreaks).not.toHaveBeenCalled();
        expect(awarded).not.toContain('On a Roll');
    });

    it('perfect math and programming', async () => {
        const a = setup();
        await a.svc.evaluateForMatch(stats({ num_correct: 3 }), players(1), MatchType.ranked, 3, 'math' as never);
        expect(a.awarded).toContain('Math Wizard');
        expect(a.awarded).not.toContain('Code Breaker');
        const b = setup();
        await b.svc.evaluateForMatch(stats({ num_correct: 3 }), players(1), MatchType.casual, 3, 'programming' as never);
        expect(b.awarded).toContain('Code Breaker');
    });

    it('comeback kid, speed demon, sharp shooter', async () => {
        const { svc, awarded } = setup();
        await svc.evaluateForMatch(stats({ min_life: 30, total_time: 60_000, num_correct: 5 }), players(1), MatchType.casual, 10);
        expect(awarded).toEqual(expect.arrayContaining(['Comeback Kid', 'Speed Demon', 'Sharp Shooter']));
    });

    it('loser gets no comeback kid', async () => {
        const { svc, awarded } = setup();
        await svc.evaluateForMatch(stats({ min_life: 10 }), players(2), MatchType.casual, 10);
        expect(awarded).not.toContain('Comeback Kid');
    });
});