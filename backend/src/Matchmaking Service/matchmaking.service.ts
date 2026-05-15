import redis from "../../redis-client"
import UserDto from "./matchmaking.dto";

const elo_difference = 100;   // this can be changed later


// adds player to queue
async function enqueue(user: UserDto, queue: string): Promise<boolean> {
    if (queue != "math" && queue != "prog") return false;

    // add user to the queue
    await redis.zadd(queue, user.elo, user.id);

    // store their joined_at time in a hash
    await redis.hset(`user:${user.id}`, "user_joined_at", user.joined_at);
    return true;
}

// remove player from the queue
async function dequeue(user_id: number, queue: string): Promise<number> {
    if (queue != "math" && queue != "prog") return -1;

    return await redis.zrem(queue, user_id);
}

async function matchmaking(user: UserDto) {

    if (user.game_mode != "math" && user.game_mode != "prog")
        throw "Unknown game mode"

    const elo_range_lower = Math.min(user.elo - elo_difference);
    const elo_range_upper = user.elo + elo_difference;

    // finds all players in the queue within the elo range
    const elo_range = await redis.zrangebyscore(user.game_mode, elo_range_lower, elo_range_upper);

    // get joined_at times for all users in the elo_range
    const result = await Promise.all(
        elo_range.map(async (user_id) => {
            const join = await redis.hget(`user:${user_id}`, "user_joined_at");
            return { user_id, join };
        })
    );

    // remove null join values
    const players = result.filter(u => u.join !== null);
    players.sort((a, b) => Number(a.join) - Number(b.join));

    if (players.length == 0) {
        enqueue(user, user.game_mode);
        return null;
    }
    else {
        const match = players[0];

        if (!match) return null;    // typescript cautious
        return { player1: user.id, player2: match.user_id };
    }
}


//export default matchmaking