import { GameMode } from "src/entities/db-entities/questions.entities";
import MatchmakingUserDTO from "src/entities/dtos/matchmaking.dto";


export interface IMatchmakingCache {

    enqueue(queue: GameMode, user: MatchmakingUserDTO): Promise<void>;
    dequeue(user_id: string, queue: GameMode): Promise<boolean>;

    getPlayers(queue: GameMode, elo: number, range: number): Promise<string[]>;
    getJoinedAt(user_id: string): Promise<(string | null)[]>;
    getUserElo(queue: GameMode, user_id: string): Promise<string | null>;
    getQueueLength(queue: GameMode): Promise<number>

    deletUser(queue: GameMode, user_id: string): Promise<number>;

}