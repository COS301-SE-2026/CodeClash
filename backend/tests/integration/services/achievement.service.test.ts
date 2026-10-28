/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { DataSource } from 'typeorm';
import { createTestDataSource } from '../../test-data-source';
import { Users } from '../../../src/entities/database/user.entities';
import { Achievement } from '../../../src/entities/database/achievement.entities';
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository';
import { AchievementRepository } from '../../../src/interface-adapters/repositories/achievement.repository';
import { AchievementService } from '../../../src/application/usecases/services/achievement.service';
import { MatchType } from '../../../src/entities/dtos/matches/match.dto';

const NAMES = [
    'First Blood', 'On a Roll', 'Unstoppable', 'Math Wizard', 'Code Breaker', 'Speed Demon',
    'Veteran', 'Century', 'Sharp Shooter', 'Social Butterfly', 'Challenger', 'Elite',
    'Champion', 'Legend', 'Comeback Kid',
];

let ds: DataSource;
let user_repo: UserRepository;
let achievement_repo: AchievementRepository;
let svc: AchievementService;
let n = 0;

beforeAll(async () => {
    ds = await createTestDataSource();
    // the init SQL has this column, synchronize() doesn't
    await ds.query(`ALTER TABLE player_achievements ADD COLUMN IF NOT EXISTS earned_at TIMESTAMP DEFAULT NOW()`);
    await ds.getRepository(Achievement).save(NAMES.map(achievement_name => ({ achievement_name, description: 'test' })));

    // CHANGE THESE TWO LINES if your repository constructors take something else
    user_repo = new UserRepository(ds as any);
    achievement_repo = new AchievementRepository(ds as any, user_repo as any);
    svc = new AchievementService(achievement_repo as any, user_repo as any);
});

afterAll(async () => { await ds.destroy(); });

const makeUser = async () => {
    n++;
    return ds.getRepository(Users).save({ cognito_id: `ach-c-${n}`, username: `ach_user_${n}`, email: `ach${n}@test.com`, avatar_id: 0 });
};

const addMatch = (players: any[], match_type: string, status = 'completed') =>
    ds.query(
        `INSERT INTO matches (title, players, match_type, match_mode, status) VALUES ($1, $2::jsonb, $3, $4, $5)`,
        ['t', JSON.stringify(players), match_type, 'math', status]
    );

const stats = (id: string, o: Record<string, number> = {}) =>
    new Map([[id, { num_correct: 0, total_time: 999_999, num_answered: 3, min_life: 100, ...o }]]);

const played = (id: string, position: number) => [{ id, position }] as any;

const names = async (id: string) => (await achievement_repo.getUserAchievements(id)).map(a => a.achievement_name);

describe('achievements (db)', () => {
    it('getAllAchievements and getAchievementByName', async () => {
        expect((await achievement_repo.getAllAchievements()).length).toBe(NAMES.length);
        expect((await achievement_repo.getAchievementByName('First Blood'))?.achievement_name).toBe('First Blood');
        expect(await achievement_repo.getAchievementByName('Nope')).toBeFalsy();
    });

    it('awardAchievement is idempotent and returns earned_at', async () => {
        const u = await makeUser();
        const a = (await achievement_repo.getAchievementByName('First Blood'))!;
        expect(await achievement_repo.hasAchievement(u.user_id, a.achievement_id)).toBe(false);
        await achievement_repo.awardAchievement(u.user_id, a.achievement_id);
        await achievement_repo.awardAchievement(u.user_id, a.achievement_id);
        const mine = await achievement_repo.getUserAchievements(u.user_id);
        expect(mine).toHaveLength(1);
        expect(mine[0]!.earned_at).toBeInstanceOf(Date);
        expect(await achievement_repo.hasAchievement(u.user_id, a.achievement_id)).toBe(true);
    });

    it('getTotalStats counts only completed ranked/tournament matches', async () => {
        const u = await makeUser();
        const o = await makeUser();
        const both = (pos: number) => [{ id: u.user_id, position: pos }, { id: o.user_id, position: 3 - pos }];
        await addMatch(both(1), 'ranked');
        await addMatch(both(2), 'tournament');
        await addMatch(both(1), 'ranked');
        await addMatch(both(1), 'casual');
        await addMatch(both(1), 'ranked', 'in_progress');

        const s = await user_repo.getTotalStats(u.user_id);
        expect(s.total_matches).toBe(3);
        expect(s.total_wins).toBe(2);
        expect(s.league).toBe('Mercury');
        expect(s.winning_streak).toBe(0);
    });

    it('On a Roll needs 3 ranked wins in a row, not 2', async () => {
        const u = await makeUser();
        for (let i = 0; i < 2; i++) {
            await svc.evaluateForMatch(stats(u.user_id), played(u.user_id, 1), MatchType.ranked, 3);
        }
        expect(await names(u.user_id)).toContain('First Blood');
        expect(await names(u.user_id)).not.toContain('On a Roll');

        await svc.evaluateForMatch(stats(u.user_id), played(u.user_id, 1), MatchType.ranked, 3);
        expect(await names(u.user_id)).toContain('On a Roll');
    });

    it('a ranked loss resets the streak', async () => {
        const u = await makeUser();
        await svc.evaluateForMatch(stats(u.user_id), played(u.user_id, 1), MatchType.ranked, 3);
        await svc.evaluateForMatch(stats(u.user_id), played(u.user_id, 2), MatchType.ranked, 3);
        expect((await user_repo.getTotalStats(u.user_id)).winning_streak).toBe(0);
    });

    it('casual wins never build a streak', async () => {
        const u = await makeUser();
        for (let i = 0; i < 3; i++) {
            await svc.evaluateForMatch(stats(u.user_id), played(u.user_id, 1), MatchType.casual, 3);
        }
        expect((await user_repo.getTotalStats(u.user_id)).winning_streak).toBe(0);
        expect(await names(u.user_id)).not.toContain('On a Roll');
    });

    it('perfect math, comeback kid and speed demon', async () => {
        const u = await makeUser();
        await svc.evaluateForMatch(
            stats(u.user_id, { num_correct: 3, total_time: 60_000, min_life: 30 }),
            played(u.user_id, 1), MatchType.casual, 3, 'math' as never
        );
        const got = await names(u.user_id);
        expect(got).toEqual(expect.arrayContaining(['Math Wizard', 'Comeback Kid', 'Speed Demon']));
        expect(got).not.toContain('Code Breaker');
    });

    it('perfect programming match gives Code Breaker', async () => {
        const u = await makeUser();
        await svc.evaluateForMatch(
            stats(u.user_id, { num_correct: 3 }), played(u.user_id, 1), MatchType.ranked, 3, 'programming' as never
        );
        expect(await names(u.user_id)).toContain('Code Breaker');
    });
});