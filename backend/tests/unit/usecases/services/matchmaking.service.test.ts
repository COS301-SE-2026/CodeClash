// intercepts redis import in the matchmaking services so the tests use a mock redis

import RedisMock from 'ioredis-mock'
import { IMatchmakingCache } from '../../../../src/application/interfaces/cache/IMatchmakingCache'
import { MatchmakingService } from '../../../../src/application/usecases/services/matchmaking.service'
import { MatchMode } from '../../../../src/entities/database/questions.entities';
import { MatchmakingUserDTO } from "../../../../src/entities/dtos/matchmaking/matchmaking.dto";
import { MatchmakingCache } from '../../../../src/interface-adapters/cache/matchmaking-cache'
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

vi.mock("src/frameworks-drivers/config/redis-client", () => {
    return { default: new RedisMock() };
});

const mock = new RedisMock()
const cache: IMatchmakingCache = new MatchmakingCache(mock)
const matchmaking_service = new MatchmakingService(cache);


let ids = 1
const ideal_math_user: MatchmakingUserDTO = {
    id: (ids++).toString(),
    elo: 1000,
    match_mode: MatchMode.Maths,
    joined_at: new Date(),
    match_attempt: 1

};
const ideal_prog_user: MatchmakingUserDTO = {
    id: (ids++).toString(),
    elo: 1010,
    match_mode: MatchMode.Programming,
    joined_at: new Date(),
    match_attempt: 1
};
const invalid_remove: MatchmakingUserDTO = {
    id: (ids++).toString(),
    elo: 1020,
    match_mode: MatchMode.Maths,
    joined_at: new Date(),
    match_attempt: 1
};


describe('Ideal Users', async () => {

    describe('Enqueue Users', () => {
        test('adds a user to the queue', async () => {
            const add = await matchmaking_service.enqueue(ideal_math_user, ideal_math_user.match_mode);
            const math_length = await matchmaking_service.math_queue_length();
            const prog_length = await matchmaking_service.prog_queue_length();

            expect(add).toBe(true);
            expect(math_length).toBe(1);
            expect(prog_length).toBe(0);

        })

        test('add user with different game mode', async () => {
            const add = await matchmaking_service.enqueue(ideal_prog_user, ideal_prog_user.match_mode);
            const math_length = await matchmaking_service.math_queue_length();
            const prog_length = await matchmaking_service.prog_queue_length();

            expect(add).toBe(true);
            expect(math_length).toBe(1);
            expect(prog_length).toBe(1);
        })
    })



    describe('Dequeue Users', () => {
        test('removes user from the queue', async () => {
            const rem = await matchmaking_service.dequeue(ideal_math_user.id, ideal_math_user.match_mode);
            const math_length = await matchmaking_service.math_queue_length();
            const prog_length = await matchmaking_service.prog_queue_length();

            expect(rem).toBe(true);
            expect(math_length).toBe(0);
            expect(prog_length).toBe(1);
        })

        test('remove user that is not in the queue', async () => {
            const rem = await matchmaking_service.dequeue(invalid_remove.id, invalid_remove.match_mode);
            const math_length = await matchmaking_service.math_queue_length();
            const prog_length = await matchmaking_service.prog_queue_length();

            expect(rem).toBe(false);
            expect(math_length).toBe(0);
            expect(prog_length).toBe(1);
        })
    })

    await mock.flushall();
    describe('Matching ideal users', () => {

        test('find a match for a user', async () => {
            const player_1_id = (ids++).toString();
            const player_2_id = (ids++).toString();
            let math_length = 0;
            const prog_length = 0;

            const player_1: MatchmakingUserDTO = {
                id: player_1_id, 
                elo: 1000, 
                match_mode: MatchMode.Maths,
                joined_at: new Date(),
                match_attempt: 1
            };
            const player_2: MatchmakingUserDTO = {
                id: player_2_id, 
                elo: 1050, 
                match_mode: MatchMode.Maths,
                joined_at: new Date(),
                match_attempt: 1
            };

            const add_p_1 = await matchmaking_service.matchmaking(player_1);  // this should not find a match
            expect(add_p_1).toBeNull();

            math_length = await matchmaking_service.math_queue_length();
            expect(math_length).toBe(1);
            expect(prog_length).toBe(0);

            const add_p_2 = await matchmaking_service.matchmaking(player_2);
            math_length = await matchmaking_service.math_queue_length();

            const expected = {
                player_2: {
                    id: player_2_id,
                    elo: 1050
                },
                player_1: {
                    id: player_1_id,
                    elo: 1000
                }
            }

            expect(add_p_2).toEqual(expected);    // should match players 1 and 2
            expect(math_length).toBe(0);    // player 1 should be removed from the queue
            expect(prog_length).toBe(0);

        })
    })
    await mock.flushall();
})



