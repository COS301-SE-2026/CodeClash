import { MatchMode } from "src/entities/dtos/match/match.dto";
import { MatchmakingUserDTO } from "src/entities/dtos/matchmaking/matchmaking.dto";


export interface IMatchmakingCache {

    enqueue(queue: MatchMode, user: MatchmakingUserDTO): Promise<void>;
    dequeue(user_id: string, queue: MatchMode): Promise<boolean>;
    getPlayers(queue: MatchMode, elo: number, range: number): Promise<string[]>;
    getJoinedAt(user_id: string): Promise<(string | null)[]>;
    getUserElo(queue: MatchMode, user_id: string): Promise<string | null>;
    getQueueLength(queue: MatchMode): Promise<number>;
    deleteUser(queue: MatchMode, user_id: string): Promise<number>;
    incrementMatchAttempt(user_id: string): Promise<void>;
}