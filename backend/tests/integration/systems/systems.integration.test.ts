// Tests for the MatchCompletion System and Life & Powerups function on the World

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { World } from '../../../src/entities/World';
import { createEcsMatch, addSubmission, buildSystems, ROUNDS, START } from '../../helpers/match-fixture';

// the store only needs names and avatars, so this stays DB-free
const fake_users: any = { getUserData: async (id: string) => ({ username: id, avatar_id: 0 }) };

let world: ReturnType<typeof World>;
let sys: ReturnType<typeof buildSystems>;
let match: number;

beforeEach(async () => {
    world = World();
    sys = buildSystems(world, fake_users);
    match = createEcsMatch(world, ['a', 'b']);
    await sys.store.create(match, 'db-1', [{ id: 'a', elo: 600 }, { id: 'b', elo: 600 }] as any, ROUNDS, new Date(START.getTime() + 600_000));
});

describe('life + powerups on the real world', () => {
    it('a wrong answer drops life and records min_life', () => {
        expect(sys.life.updatePlayerLife(match, 'a', false)).toBeLessThan(100);
        const entity = world.getMatchComponent<any>(match, 'Players')!.players.get('a')!;
        expect(world.getPlayerComponent<any>(entity, 'Life')!.min_life).toBeLessThan(100);
    });

    it('drain stops at 1 life and restore is capped at max', () => {
        sys.powerup.apply(match, 'drain_life', { value: 50 } as any, 'a', 'b');
        expect(sys.life.getPlayerLife(match, 'b')).toBe(50);
        sys.powerup.apply(match, 'drain_life', { value: 100 } as any, 'a', 'b');
        expect(sys.life.getPlayerLife(match, 'b')).toBe(1);
        sys.powerup.apply(match, 'restore_life', { value: 500 } as any, 'b', 'a');
        expect(sys.life.getPlayerLife(match, 'b')).toBe(100);
    });

    it('shield absorbs exactly one powerdown', () => {
        sys.powerup.apply(match, 'block_next_powerdown', {} as any, 'b');
        expect(sys.powerup.apply(match, 'drain_life', { value: 40 } as any, 'a', 'b').blocked).toBe(true);
        expect(sys.life.getPlayerLife(match, 'b')).toBe(100);
        expect(sys.powerup.apply(match, 'drain_life', { value: 40 } as any, 'a', 'b').blocked).toBe(false);
        expect(sys.life.getPlayerLife(match, 'b')).toBe(60);
    });

    it('blackout picks a question the target has not answered', () => {
        addSubmission(world, match, 'b', 'q1', 1000, true);
        const res = sys.powerup.apply(match, 'blackout_question', {} as any, 'a', 'b', ['q1', 'q2']);
        expect(res.question_id).toBe('q2');
        expect(sys.powerup.getClientState(match, 'b').blackout_question_id).toBe('q2');
    });
});

describe('MatchCompletionSystem', () => {
    beforeEach(() => {
        addSubmission(world, match, 'a', 'q1', 1000, true);
        addSubmission(world, match, 'a', 'q2', 2000, true);
        addSubmission(world, match, 'b', 'q1', 1500, true);
        addSubmission(world, match, 'b', 'q2', 2500, false);
    });

    it('ranks by correct answers, applies time powerups, copies min_life, stores the result', () => {
        sys.powerup.apply(match, 'reduce_time', { value: 1 } as any, 'a', 'b');
        sys.powerup.apply(match, 'drain_life', { value: 30 } as any, 'a', 'b');

        const { players, match_stats, total_questions } = sys.completion.execute(match, ['a', 'b']);

        expect(total_questions).toBe(2);
        expect(players.map(p => [p.id, p.position])).toEqual([['a', 1], ['b', 2]]);
        expect(match_stats.get('a')!.num_correct).toBe(2);
        expect(match_stats.get('a')!.total_time).toBe(1000);   // 2000ms - 1s reduce_time
        expect(match_stats.get('b')!.min_life).toBe(70);
        expect(match_stats.get('a')!.min_life).toBe(100);
        expect(world.getMatchComponent(match, 'Result')).toBeTruthy();
    });

    it('an eliminated player ranks below everyone still standing', () => {
        sys.store.eliminate('a', match);
        const { players } = sys.completion.execute(match, ['a', 'b']);
        expect(players[0]!.id).toBe('b');
    });

    it('needs two players', () => {
        const solo = createEcsMatch(world, ['a']);
        expect(() => sys.completion.execute(solo, ['a'])).toThrow();
    });
});