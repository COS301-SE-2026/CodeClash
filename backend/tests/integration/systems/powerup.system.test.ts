/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PowerupSystem } from '../../../src/application/usecases/systems/powerup.system';

const makeWorld = () => {
    const store = new Map<string, unknown>();
    return {
        getMatchComponent: (id: number, t: string) => store.get(`${id}:${t}`),
        addMatchComponent: (id: number, t: string, c: unknown) => { store.set(`${id}:${t}`, c); },
    } as any;
};

describe('PowerupSystem', () => {
    let life: { getPlayerLife: any; adjustLife: any };
    let subs: { playerSubmissions: any };
    let sys: PowerupSystem;

    beforeEach(() => {
        life = { getPlayerLife: vi.fn(() => 100), adjustLife: vi.fn() };
        subs = { playerSubmissions: vi.fn(() => []) };
        sys = new PowerupSystem(makeWorld(), life as any, subs as any);
    });

    it('classifies powerdowns', () => {
        expect(sys.isPowerdown('drain_life')).toBe(true);
        expect(sys.isPowerdown('restore_life')).toBe(false);
    });

    it('restore_life heals the actor by value', () => {
        sys.apply(1, 'restore_life', { value: 20 } as any, 'a', 'b');
        expect(life.adjustLife).toHaveBeenCalledWith(1, 'a', 20);
    });

    it('drain_life drains target but leaves 1 life', () => {
        life.getPlayerLife.mockReturnValue(30);
        sys.apply(1, 'drain_life', { value: 20 } as any, 'a', 'b');
        expect(life.adjustLife).toHaveBeenCalledWith(1, 'b', -20);
    });

    it('shield blocks one powerdown then drops', () => {
        sys.apply(1, 'block_next_powerdown', {} as any, 'a');
        expect(sys.getClientState(1, 'a').shield_active).toBe(true);
        expect(sys.apply(1, 'drain_life', { value: 10 } as any, 'b', 'a').blocked).toBe(true);
        expect(sys.apply(1, 'drain_life', { value: 10 } as any, 'b', 'a').blocked).toBe(false);
    });

    it('time and score effects accumulate', () => {
        sys.apply(1, 'reduce_time', { value: 10 } as any, 'a', 'b');
        sys.apply(1, 'increase_time', { value: 20 } as any, 'a', 'b');
        sys.apply(1, 'score_multiplier', { value: 25 } as any, 'a', 'b');
        expect(sys.getTimeDeltaSeconds(1, 'a')).toBe(-10);
        expect(sys.getTimeDeltaSeconds(1, 'b')).toBe(20);
        expect(sys.getScoreMultiplierPercent(1, 'a')).toBe(25);
    });

    it('wipe_answer can only be used once per target', () => {
        sys.apply(1, 'wipe_answer', {} as any, 'a', 'b');
        expect(() => sys.validate(1, 'wipe_answer', 'b')).toThrow();
    });

    it('blackout picks an unanswered question and blocks a second', () => {
        const res = sys.apply(1, 'blackout_question', {} as any, 'a', 'b', ['q1', 'q2']);
        expect(['q1', 'q2']).toContain(res.question_id);
        expect(sys.getClientState(1, 'b').blackout_question_id).toBe(res.question_id);
        expect(() => sys.validate(1, 'blackout_question', 'b', ['q1', 'q2'])).toThrow();
    });

    it('blackout rejects when everything is answered', () => {
        subs.playerSubmissions.mockReturnValue([{ question_id: 'q1' }]);
        expect(() => sys.validate(1, 'blackout_question', 'c', ['q1'])).toThrow();
    });

    it('insert_bugs is a no-op server side, unknown effect throws', () => {
        expect(sys.apply(1, 'insert_bugs', {} as any, 'a', 'b').blocked).toBe(false);
        expect(() => sys.apply(1, 'nope', {} as any, 'a', 'b')).toThrow();
    });
});