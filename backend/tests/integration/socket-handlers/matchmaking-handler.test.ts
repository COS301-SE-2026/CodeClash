import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { MatchConfirmationService } from '../../../src/application/usecases/services/match/match-confirmation.service'
import { joinMatchQueue } from '../../../src/interface-adapters/socket-handlers/matchmaking-handlers'
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';
import { MatchmakingService } from '../../../src/application/usecases/services/matchmaking.service';
import redis from '../../../src/frameworks-drivers/config/redis-client'
import { MatchmakingCache } from '../../../src/interface-adapters/cache/matchmaking-cache'

const confirmation = new MatchConfirmationService();
const cache = new MatchmakingCache(redis);
const service = new MatchmakingService(cache);
const user_repo = {
    getUserData: async () => ({
        elo: 1000,
        username: 'test'
    })
} as any;


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


let emitted: {
    room: string,
    event: string,
    data?: any
}[] = [];

const io = {
    to: (room: string) => ({
        emit: (event: string, data?: any) => {
            emitted.push({ room, event, data });
        }
    }),
    in: () => ({ fetchSockets: async () => [{}] })
} as any;

const socket = (id: string) => ({
    data: {
        user_id: id
    },
    join: vi.fn()
}) as any;


const join = (id: string) => joinMatchQueue(io, socket(id), { match_mode: MatchMode.Maths, match_type: MatchType.ranked }, service, confirmation, user_repo);


describe("Tests matchmaking socket handler", () => {
    beforeEach(() => {
        vi.useFakeTimers({
            toFake: ['setTimeout']
        })
    })

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    })


    it("tests matchmaking race condition", async () => {
        const ids = ['a', 'b', 'c'];
        const queue = `${MatchType.ranked}-${MatchMode.Maths}`;

        for (let run = 0; run < 20; run++) {
            const keys = await redis.keys('user:*');
            await redis.del([...queues, ...keys]);
            emitted = [];

            await Promise.all(ids.map(join));

            const matched = emitted.filter((e) => e.event === 'users_matched');
            const rooms = matched.map((e) => e.room);

            expect(rooms).toHaveLength(2);
            expect(new Set(rooms).size).toBe(2);
            expect(matched[0].data.group_id).toBe(matched[1].data.group_id);

            const queued = [];
            for (const id of ids) {
                if (await redis.zscore(queue, id) !== null)
                    queued.push(id);
            }

            expect(queued).toHaveLength(1);
        }
    })
})