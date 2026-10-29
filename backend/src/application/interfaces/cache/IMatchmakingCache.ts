import { MatchmakingUserDTO } from "src/entities/dtos/matchmaking/matchmaking.dto";

export interface IMatchmakingCache {

    enqueue(queue: string, user: MatchmakingUserDTO): Promise<void>;
    dequeue(user_id: string, queue: string): Promise<boolean>;
    getPlayers(queue: string, elo: number, range: number): Promise<string[]>;
    getJoinedAt(user_id: string): Promise<(string | null)>;
    getUserElo(queue: string, user_id: string): Promise<string | null>;
    getQueueLength(queue: string): Promise<number>;
    deleteUser(queue: string, user_id: string): Promise<number>;
    incrementMatchAttempt(user_id: string): Promise<void>;
}