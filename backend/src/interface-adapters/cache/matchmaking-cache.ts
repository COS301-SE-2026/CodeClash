import Redis from "ioredis";
import { IMatchmakingCache } from "src/application/interfaces/cache/IMatchmakingCache";
import { MatchMode } from "src/entities/dtos/match/match.dto";
import { MatchmakingUserDTO } from "src/entities/dtos/matchmaking/matchmaking.dto";

export class MatchmakingCache implements IMatchmakingCache {
    constructor(
        private readonly redis: Redis
    ) { }


    async enqueue(queue: MatchMode, user: MatchmakingUserDTO): Promise<void> {
        await this.redis.zadd(queue, user.elo, user.id);
        await this.redis.hset(`user:${user.id}`, {
            "user_joined_at": user.joined_at.getTime(),
            "match_attempt": user.match_attempt
        });
    }

    async dequeue(user_id: string, queue: MatchMode): Promise<boolean> {

        const rem_joined_hash = await this.redis.hdel(`user:${user_id}`, 'user_joined_at');
        const rem_user = await this.redis.zrem(queue, user_id);

        if (rem_joined_hash == 0 || rem_user == 0)
            return false;

        return true;
    }


    async getPlayers(queue: MatchMode, elo: number, range: number): Promise<string[]> {
        const lower = Math.max(0, elo - range);
        const upper = elo + range;

        return this.redis.zrangebyscore(queue, lower, upper);

    }

    async getUserElo(queue: MatchMode, user_id: string): Promise<string | null> {
        return await this.redis.zscore(queue, user_id);

    }

    async getJoinedAt(user_id: string): Promise<(string | null)[]> {
        return await this.redis.hmget(`user:${user_id}`, "user_joined_at");
    }


    async getQueueLength(queue: MatchMode): Promise<number> {
        return await this.redis.zcard(queue);
    }

    async deleteUser(queue: MatchMode, user_id: string): Promise<number> {

        const count = await this.redis.zrem(queue, user_id);
        await this.redis.hdel(`user:${user_id}`, "user_joined_at");

        return count;
    }

    async incrementMatchAttempt(user_id: string): Promise<void> {
        await this.redis.hincrby(`user:${user_id}`, "match_attempt", 1);
    }

}