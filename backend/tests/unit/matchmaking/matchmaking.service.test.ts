// intercepts redis import in the matchmaking services so the tests use a mock redis

import { vi, describe, test, expect } from 'vitest';

vi.mock("../../../redis-client", () => {
    const Redis_Mock = require('ioredis-mock')
    return { default: new Redis_Mock.default() };
});

import { dequeue, enqueue, matchmaking, math_queue_length, prog_queue_length } from "../../../src/Matchmaking Service/matchmaking.service";
import UserDto from "../../../src/Matchmaking Service/matchmaking.dto";
import redis from "../../../redis-client";


let ids = 1
const ideal_math_user = new UserDto(ids++, 1000, 'math');
const ideal_prog_user = new UserDto(ids++, 1010, 'prog');
const invalid_game_mode = new UserDto(ids++, 2020, 'stats');
const invalid_remove = new UserDto(ids++, 1020, 'math');


// to clear queue between tests
async function clearQueues() {
    await redis.del('math');
    await redis.del('prog');

    let cursor;

    do {
        const [upd_cursor, hash_keys] = await redis.scan(0, 'MATCH', 'user:*');

        cursor = upd_cursor;
        if (hash_keys.length > 0) {
            await Promise.all(
                hash_keys.map(async (key) => {
                    await redis.del(key);
                })
            )
        }
    } while (cursor != '0')

}

describe('Ideal Users', () => {
    describe('Enqueue Users', () => {
        test('adds a user to the queue', async () => {
            const add = await enqueue(ideal_math_user, ideal_math_user.game_mode);
            const math_length = await math_queue_length();
            const prog_length = await prog_queue_length();

            expect(add).toBe(true);
            expect(math_length).toBe(1);
            expect(prog_length).toBe(0);

        })

        test('add user with different game mode', async () => {
            const add = await enqueue(ideal_prog_user, ideal_prog_user.game_mode);
            const math_length = await math_queue_length();
            const prog_length = await prog_queue_length();

            expect(add).toBe(true);
            expect(math_length).toBe(1);
            expect(prog_length).toBe(1);
        })
    })

    describe('Dequeue Users', () => {
        test('removes user from the queue', async () => {
            const rem = await dequeue(ideal_math_user.id, ideal_math_user.game_mode);
            const math_length = await math_queue_length();
            const prog_length = await prog_queue_length();

            expect(rem).toBe(true);
            expect(math_length).toBe(0);
            expect(prog_length).toBe(1);
        })

        test('remove user that is not in the queue', async () => {
            const rem = await dequeue(invalid_remove.id, invalid_remove.game_mode);
            const math_length = await math_queue_length();
            const prog_length = await prog_queue_length();

            expect(rem).toBe(false);
            expect(math_length).toBe(0);
            expect(prog_length).toBe(1);
        })
    })

    describe('Matching ideal users', () => {
        // clear the queues for fresh test
        clearQueues();

        test('find a match for a user', async () => {
            let player_1_id = ids++;
            let player_2_id = ids++;
            let math_length = 0;
            let prog_length = 0;

            const player_1 = new UserDto(player_1_id, 1000, 'math');
            const player_2 = new UserDto(player_2_id, 1050, 'math');

            const add_p_1 = await matchmaking(player_1);  // this should not find a match
            expect(add_p_1).toBeNull();

            math_length = await math_queue_length();
            expect(math_length).toBe(1);
            expect(prog_length).toBe(0);


            const add_p_2 = await matchmaking(player_2);
            math_length = await math_queue_length();

            expect(add_p_2).toEqual({ player_2_id, player_1_id });    // should match players 1 and 2
            expect(math_length).toBe(0);    // player 1 should be removed from the queue
            expect(prog_length).toBe(0);

        })
    })
})


describe('Invalid game mode', () => {
    test('Adds user with invalid game mode', async () => {
        const add = await enqueue(invalid_game_mode, invalid_game_mode.game_mode);
        expect(add).toBe(false);
    })

    test('Remove invalid game mode', async () => {
        const rem = await dequeue(invalid_game_mode.id, invalid_game_mode.game_mode);
        expect(rem).toBe(false);
    })
})


