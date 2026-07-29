import Redis from "ioredis";
import { IMatchmakingCache } from "src/application/interfaces/IMatchmakingCache";
import { GameMode } from "src/entities/db-entities/questions.entities";
import MatchmakingUserDTO from "src/entities/dtos/matchmaking.dto";

export class MatchmakingCache implements IMatchmakingCache {
    constructor(
        private readonly redis: Redis
    ) { }


    async enqueue(queue: GameMode, user: MatchmakingUserDTO): Promise<void> {
        this.redis.zadd(queue, user.elo, user.id);
        this.redis.hset(`user:${user.id}`, "user_joined_at", user.joined_at)


    }

    async dequeue(user_id: string, queue: GameMode): Promise<boolean> {

        const rem_joined_hash = await this.redis.hdel(`user:${user_id}`, 'user_joined_at');
        const rem_user = await this.redis.zrem(queue, user_id);

        if (rem_joined_hash == 0 || rem_user == 0)
            return false;

        return true;
    }


    async getPlayers(queue: GameMode, elo: number, range: number): Promise<string[]> {
        const lower = Math.min(0, elo - range);
        const upper = elo + range;

        return this.redis.zrangebyscore(queue, lower, upper);

    }

    async getUserElo(queue: GameMode, user_id: string): Promise<string | null> {
        return this.redis.zscore(queue, user_id);

    }

    async getJoinedAt(user_id: string): Promise<(string | null)[]> {
        return this.redis.hmget(`user:${ user_id }`, "user_joined_at");
    }


    async getQueueLength(queue: GameMode): Promise<number> {
        return await this.redis.zcard(queue);
    }

    async deletUser(queue: GameMode, user_id: string): Promise<number> {

        const count = this.redis.zrem(queue, user_id);
        this.redis.hdel(`user:${user_id}`, "user_joined_at");

        return count;
    }


}