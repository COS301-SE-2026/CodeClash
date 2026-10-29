import { MatchmakingCache } from '../../../src/interface-adapters/cache/matchmaking-cache';
import redis from '../../../src/frameworks-drivers/config/redis-client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ranked_maths_users, ranked_prog_users, casual_maths_users, casual_prog_users } from '../../mocks/mock-user';
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';
import { randomUUID } from 'node:crypto';

const matchmaking_cache = new MatchmakingCache(redis);
const ranked_maths_queue = MatchType.ranked + "-" + MatchMode.Maths;
const ranked_prog_queue = MatchType.ranked + "-" + MatchMode.Programming;
const casual_maths_queue = MatchType.casual + "-" + MatchMode.Maths;
const casual_prog_queue = MatchType.casual + "-" + MatchMode.Programming;

const queues = [
    ranked_maths_queue,
    ranked_prog_queue,
    casual_maths_queue,
    casual_prog_queue
]

const ranked_maths = ranked_maths_users[0];
const ranked_prog = ranked_prog_users[0];
const casual_maths = casual_maths_users[0];
const casual_prog = casual_prog_users[0];

describe("Tests matchmaking cache", () => {
    beforeAll(async () => {
        await redis.del(...queues);
    })

    afterAll(async () => {
        await redis.del(...queues);
        await redis.quit();
    })

    it("Enqueus different types of users", async () => {


        await matchmaking_cache.enqueue(ranked_maths_queue, ranked_maths);
        await matchmaking_cache.enqueue(ranked_prog_queue, ranked_prog);
        await matchmaking_cache.enqueue(casual_maths_queue, casual_maths);
        await matchmaking_cache.enqueue(casual_prog_queue, casual_prog);

        for (const queue of queues) {
            const length = await redis.zcard(queue);
            expect(length).toBe(1);
        }
    });

    it("Dequeues a user", async () => {
        const rem = await matchmaking_cache.dequeue(ranked_maths.id, ranked_maths_queue);
        expect(rem).toBe(true);
    });

    it("Dequeues from an empty queue", async () => {
        const rem = await matchmaking_cache.dequeue(ranked_maths.id, ranked_maths_queue);
        expect(rem).toBe(false);
    })

    it("Gets a users elo", async () => {
        const elo = await matchmaking_cache.getUserElo(ranked_prog_queue, ranked_prog.id);
        expect(elo).toBe(ranked_prog.elo.toString());
    });

    it("Gets a users joined at time", async () => {
        const joined = await matchmaking_cache.getJoinedAt(casual_maths.id);
        expect(joined).toBe(casual_maths.joined_at.getTime().toString());
    });

    it("Gets a player within an elo range", async () => {
        for (let i = 1; i < ranked_prog_users.length; i++) {
            await matchmaking_cache.enqueue(ranked_prog_queue, ranked_prog_users[i]);
        }

        const elo = 600;
        const range = 100;

        const expected_players = ranked_prog_users.filter((u) => u.elo >= Math.max(0, elo - range) && u.elo <= elo + range).map(u => u.id);
        const players = await matchmaking_cache.getPlayers(ranked_prog_queue, elo, range);

        expect([...players].sort()).toEqual([...expected_players].sort());
    });

    it("Uses an invalid user id", async () => {
        const rem = await matchmaking_cache.dequeue(randomUUID(), casual_maths_queue);
        expect(rem).toBe(false);


        const user = await matchmaking_cache.getUserElo(casual_prog_queue, randomUUID());
        expect(user).toBeNull();

        const join = await matchmaking_cache.getJoinedAt(randomUUID());
        expect(join).toBeNull();
    })



})