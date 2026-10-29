/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import type { DataSource } from 'typeorm';
import { createTestDataSource } from '../../test-data-source';
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';
import { matchDone, sendResults, rejoinMatch } from '../../../src/interface-adapters/socket-handlers/match-handlers';
import { buildDeps, makeMatchContext, seedAchievements, type Deps } from '../../helpers/match-fixture';

let ds: DataSource;
let deps: Deps;

beforeAll(async () => {
    ds = await createTestDataSource();
    await ds.query(`ALTER TABLE player_achievements ADD COLUMN IF NOT EXISTS earned_at TIMESTAMP DEFAULT NOW()`);
    await seedAchievements(ds, ['First Blood']);
    deps = buildDeps(ds);
});

afterAll(async () => { await ds.destroy(); });

const sock = (id: string): any => ({ data: { user_id: id }, emit: vi.fn() });
const fakeIo = () => {
    const emit = vi.fn();
    return { io: { to: vi.fn(() => ({ emit })) } as any, emit };
};

describe('match handlers (real store + completion service)', () => {
    it('first finisher waits, second completes; each sees only their own reward', async () => {
        const c = await makeMatchContext(ds, deps, MatchType.casual);
        const { io, emit } = fakeIo();
        const a = sock(c.w.user_id);

        await matchDone(io, a, c.db_id, MatchType.casual, c.service, c.sys.store, MatchMode.Maths);
        expect(a.emit).toHaveBeenCalledWith('waiting_opponent');
        expect(emit).toHaveBeenCalledWith('opponent_done');

        const res: any = await matchDone(io, sock(c.l.user_id), c.db_id, MatchType.casual, c.service, c.sys.store, MatchMode.Maths);
        expect(emit).toHaveBeenCalledWith('both_done');
        expect(res.players.find((p: any) => p.user_id === c.w.user_id).reward).toBeUndefined();
        expect(res.players.find((p: any) => p.user_id === c.l.user_id).reward).toBeGreaterThan(0);

        // already completed: served from the store, not recomputed
        const again: any = await matchDone(io, a, c.db_id, MatchType.casual, c.service, c.sys.store);
        expect(again.players.find((p: any) => p.user_id === c.w.user_id).reward).toBeGreaterThan(0);

        const mine: any = sendResults(io, c.db_id, c.sys.store, c.w.user_id);
        expect(mine.players.find((p: any) => p.user_id === c.l.user_id).reward).toBeUndefined();
    });

    it('an eliminated player finishes the match for both', async () => {
        const c = await makeMatchContext(ds, deps, MatchType.casual);
        const { io } = fakeIo();
        c.sys.store.eliminate(c.l.user_id, c.ecs);
        const res: any = await matchDone(io, sock(c.w.user_id), c.db_id, MatchType.casual, c.service, c.sys.store, MatchMode.Maths);
        expect(res.players[0].user_id).toBe(c.w.user_id);
    });

    it('sendResults before completion returns nothing', async () => {
        const c = await makeMatchContext(ds, deps, MatchType.casual);
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(sendResults(fakeIo().io, c.db_id, c.sys.store, c.w.user_id)).toBeUndefined();
        err.mockRestore();
    });

    it('rejoin reports my shield but never the opponent\'s', async () => {
        const c = await makeMatchContext(ds, deps, MatchType.casual);
        c.sys.powerup.apply(c.ecs, 'block_next_powerdown', {} as any, c.w.user_id);

        const mine = rejoinMatch(sock(c.w.user_id), c.db_id, c.sys.store, c.sys.submissions as any, c.sys.life, c.sys.powerup);
        expect(mine.powerups.shield).toBe(true);
        expect(mine.submissions).toHaveLength(2);
        expect(mine.completed).toBe(false);

        const theirs = rejoinMatch(sock(c.l.user_id), c.db_id, c.sys.store, c.sys.submissions as any, c.sys.life, c.sys.powerup);
        expect(theirs.powerups.shield).toBe(false);
        expect(theirs.powerups.opponent_shield).toBe(false);
        expect(theirs.opponent_progress).not.toBeNull();
    });

    it('rejoin rejects a match the player is not in', () => {
        return makeMatchContext(ds, deps, MatchType.casual).then(c => {
            expect(() => rejoinMatch(sock('stranger'), c.db_id, c.sys.store, c.sys.submissions as any, c.sys.life, c.sys.powerup))
                .toThrow('Match not found');
        });
    });
});