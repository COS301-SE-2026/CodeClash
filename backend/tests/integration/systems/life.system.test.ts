/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { LifeSystem } from '../../../src/application/usecases/systems/life.system';

const make = (question_number = 1) => {
    const life: any = { current_life: 100, max_life: 100 };
    const world: any = {
        getPlayerComponent: vi.fn(() => life),
        getMatchComponent: vi.fn((_id: number, t: string) =>
            t === 'Players' ? { players: new Map([['p1', 7]]) } : { question_number }),
    };
    return { life, sys: new LifeSystem(world) };
};

describe('LifeSystem', () => {
    it('decrement reduces life and records min_life', () => {
        const { life, sys } = make();
        const after = sys.decrement(7, 1);
        expect(after).toBeCloseTo(100 - 100 / 3);
        expect(life.min_life).toBeCloseTo(after);
    });

    it('decrement with question_number <= 0 does nothing', () => {
        const { sys } = make();
        expect(sys.decrement(7, 0)).toBe(100);
    });

    it('increment heals, and does nothing at max', () => {
        const { life, sys } = make();
        expect(sys.increment(7, 2)).toBe(100);
        life.current_life = 50;
        expect(sys.increment(7, 2)).toBeGreaterThan(50);
        expect(sys.increment(7, 0)).toBeGreaterThan(50);
    });

    it('adjustLife clamps and tracks min_life', () => {
        const { life, sys } = make();
        expect(sys.adjustLife(1, 'p1', -150)).toBe(0);
        expect(life.min_life).toBe(0);
        expect(sys.adjustLife(1, 'p1', 500)).toBe(100);
    });

    it('updatePlayerLife only drops on wrong answers', () => {
        const { sys } = make();
        expect(sys.updatePlayerLife(1, 'p1', true)).toBe(100);
        expect(sys.updatePlayerLife(1, 'p1', false)).toBeLessThan(100);
        expect(sys.getPlayerLife(1, 'p1')).toBeLessThan(100);
    });

    it('unknown player throws', () => {
        const { sys } = make();
        expect(() => sys.getPlayerLife(1, 'nope')).toThrow('Invalid Player');
        expect(() => sys.updatePlayerLife(1, 'nope', true)).toThrow();
        expect(() => sys.adjustLife(1, 'nope', 1)).toThrow();
    });
});