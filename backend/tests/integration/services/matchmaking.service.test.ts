import { describe, expect, it } from 'vitest';
import { MatchmakingService } from '../../../src/application/usecases/services/matchmaking.service';
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { MatchmakingCache } from '../../../src/interface-adapters/cache/matchmaking-cache'
import { ranked_maths_users } from '../../mocks/mock-user'
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';





const cache = new MatchmakingCache(redis);
const service = new MatchmakingService(cache);


describe("Integration Testing Matchmaking", () => {
    it("Enqueues a ranked maths player", async () => {
        const add_ranked = await service.matchmaking(ranked_maths_users[0]);

        expect(add_ranked).toBeNull();
        expect(await redis.zcard(MatchType.ranked + "-" + MatchMode.Maths)).toBe(1);
    })
})