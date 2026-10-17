import { beforeAll, describe, expect, it } from 'vitest';
import { MatchmakingService } from '../../../src/application/usecases/services/matchmaking.service';
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { MatchmakingCache } from '../../../src/interface-adapters/cache/matchmaking-cache'
import { ranked_maths_users, casual_maths_users } from '../../mocks/mock-user'
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';

const cache = new MatchmakingCache(redis);
const service = new MatchmakingService(cache);
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Integration Testing Matchmaking", () => {

    beforeAll(async () => {
        await redis.del(...queues);

        const keys = await redis.keys('user:*');
        await redis.del(keys);
    })

    it("Enqueues a ranked maths player", async () => {
        const add_ranked = await service.matchmaking(ranked_maths_users[0]);

        expect(add_ranked).toBeNull();
        expect(await redis.zcard(MatchType.ranked + "-" + MatchMode.Maths)).toBe(1);
    });

    it("Enqueues a casual maths player", async () => {
        const add_casual = await service.matchmaking(casual_maths_users[0]);

        expect(add_casual).toBeNull();
        expect(await redis.zcard(MatchType.casual + "-" + MatchMode.Maths)).toBe(1);
    })

    it("Tests race condition for multiple players trying to match", async () => {
        await Promise.all([service.matchmaking(ranked_maths_users[1]), service.matchmaking(ranked_maths_users[2]), service.matchmaking(ranked_maths_users[3])]);

        //const queue = 
    })
})