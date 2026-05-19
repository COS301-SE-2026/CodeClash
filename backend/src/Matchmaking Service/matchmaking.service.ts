import redis from "../../redis-client"
import UserDto from "./matchmaking.dto";


const elo_difference = 100;   // this can be changed later


// adds player to queue
async function enqueue(user: UserDto, queue: string): Promise<boolean> {
    if (queue != "math" && queue != "prog") return false;

    // add user to the queue
    await redis.zadd(queue, user.elo, user.id);

    // store their joined_at time and game mode in a hash
    await redis.hset(`user:${user.id}`, "user_joined_at", user.joined_at, "user_game_mode", user.game_mode);
    return true;
}

// remove player from the queue
async function dequeue(user_id: number, queue: string): Promise<boolean> {
    if (queue != "math" && queue != "prog") return false;

    const rem_joined_hash = await redis.hdel(`user:${user_id}`);
    const rem_user = await redis.zrem(queue, user_id);

    if (rem_joined_hash || rem_user == 0)
        return false;

    return true;
}


// finds a match for a the passed in user
async function matchmaking(user: UserDto) {

    if (user.game_mode != "math" && user.game_mode != "prog")
        throw new Error("Unknown game mode");

    const range = elo_difference * user.match_attempt;

    const elo_range_lower = Math.min(0, user.elo - range);
    const elo_range_upper = user.elo + range;


    // finds all players in the queue within the elo range
    const elo_range = await redis.zrangebyscore(user.game_mode, elo_range_lower, elo_range_upper);

    // get joined_at times for all users in the elo_range
    const result = await Promise.all(
        elo_range.map(async (user_id) => {
            const [join, game_mode] = await redis.hmget(`user:${user_id}`, "user_joined_at", "user_game_mode");
            return { user_id, join, game_mode };
        })
    );

    // remove null join values
    let players = result.filter(u => u.join !== null);
    // sort by joined times - ascending
    players.sort((a, b) => Number(a.join) - Number(b.join));
    if (players.length == 0) {

        const waiting = await redis.zscore(user.game_mode, user.id.toString());

        if (waiting)   //user isn't already in the queue
            ++user.match_attempt;
        else {
            enqueue(user, user.game_mode);
        }

        return null;
    }
    else {
        const match = players[0];

        if (!match) return null;

        // found a match
        // remove players from queue
        await redis.zrem(user.game_mode, user.id);
        await redis.zrem(user.game_mode, match.user_id);

        //remove joined_at hash
        await redis.hdel(`user:${user.id}`);
        await redis.hdel(`user:${match.user_id}`);

        return { player_2_id: user.id, player_1_id: Number(match.user_id) };
    }
}

async function math_queue_length(): Promise<number> {
    return await redis.zcard('math');
}

async function prog_queue_length(): Promise<number> {
    return await redis.zcard('prog');
}


export { matchmaking, dequeue, enqueue, math_queue_length, prog_queue_length };