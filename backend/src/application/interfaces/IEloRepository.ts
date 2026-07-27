
import { EloDTO } from "src/entities/dtos/elo.dto"
import { LeaderboardEntryDTO } from "src/entities/dtos/leaderboard.dto"


export interface IEloRepository {
    // Creat
    createUserElo(user_id: string): Promise<void>

    // Read
    getElo(user_id: string): Promise<EloDTO | null>
    getUsersElo(user_ids: string[]): Promise<EloDTO[] | null>
    getLeaderboard(limit?: number): Promise<LeaderboardEntryDTO[]>
}
