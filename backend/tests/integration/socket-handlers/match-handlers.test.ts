/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { matchDone, sendResults } from '../../../src/interface-adapters/socket-handlers/match-handlers';
import { MatchType } from '../../../src/entities/dtos/matches/match.dto';

const setup = () => {
    const players: any[] = [{ id: 'a', done: false }, { id: 'b', done: false }];
    const match: any = { database_id: 'db1', players, result: null, completed: false };
    const store: any = {
        getEcsId: () => 1, get: () => match,
        setDone: (id: string) => { players.find(p => p.id === id).done = true; },
        playersDone: () => players.every(p => p.done),
        saveResult: (_: number, r: any) => { match.result = r; },
        getResult: () => match.result,
    };
    const emit = vi.fn();
    const io: any = { to: vi.fn(() => ({ emit })) };
    const completion: any = {
        execute: vi.fn(async () => ({ match_id: 'db1', players: [{ user_id: 'a', reward: 100 }, { user_id: 'b', reward: 50 }] })),
    };
    const sock = (id: string): any => ({ data: { user_id: id }, emit: vi.fn() });
    return { match, store, io, emit, completion, sock };
};

describe('match-handlers', () => {
    it('first finisher waits, second completes and sees only own reward', async () => {
        const { store, io, emit, completion, sock } = setup();
        const a = sock('a');
        await matchDone(io, a, 'db1', MatchType.casual, completion, store);
        expect(a.emit).toHaveBeenCalledWith('waiting_opponent');
        expect(emit).toHaveBeenCalledWith('opponent_done');

        const res: any = await matchDone(io, sock('b'), 'db1', MatchType.casual, completion, store, 'math' as never);
        expect(emit).toHaveBeenCalledWith('both_done');
        expect(res.players.find((p: any) => p.user_id === 'a').reward).toBeUndefined();
        expect(res.players.find((p: any) => p.user_id === 'b').reward).toBe(50);

        const again: any = await matchDone(io, sock('a'), 'db1', MatchType.casual, completion, store);
        expect(again.players.find((p: any) => p.user_id === 'a').reward).toBe(100);
        expect(completion.execute).toHaveBeenCalledTimes(1);
    });

    it('a failed completion can be retried', async () => {
        const { match, store, io, completion, sock } = setup();
        completion.execute.mockRejectedValueOnce(new Error('x'));
        await matchDone(io, sock('a'), 'db1', MatchType.casual, completion, store);
        await expect(matchDone(io, sock('b'), 'db1', MatchType.casual, completion, store)).rejects.toThrow('x');
        expect(match.completed).toBe(false);
    });

    it('unknown match returns undefined', async () => {
        const { store, io, completion, sock } = setup();
        store.get = () => undefined;
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(await matchDone(io, sock('a'), 'x', MatchType.casual, completion, store)).toBeUndefined();
        err.mockRestore();
    });

    it('sendResults filters per requester and handles missing data', () => {
        const { match, store, io } = setup();
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(sendResults(io, 'db1', store, 'a')).toBeUndefined();   // no result yet
        match.result = { match_id: 'db1', players: [{ user_id: 'a', reward: 1 }, { user_id: 'b', reward: 2 }] };
        const res: any = sendResults(io, 'db1', store, 'a');
        expect(res.players[0].reward).toBe(1);
        expect(res.players[1].reward).toBeUndefined();
        store.get = () => undefined;
        expect(sendResults(io, 'db1', store, 'a')).toBeUndefined();
        warn.mockRestore(); err.mockRestore();
    });
});