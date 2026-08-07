
import { EloDTO } from "src/interface-adapters/dtos/elo.dto"
import { LeaderboardEntryDTO } from "src/interface-adapters/dtos/leaderboard.dto"


export interface IEloRepository {
    // Creat
    createUserElo(user_id: string): Promise<void>

    // Read
    getElo(user_id: string): Promise<EloDTO | null>
    getUsersElo(user_ids: string[]): Promise<EloDTO[] | null>
    getLeaderboard(limit: number, offset: number): Promise<{ data: LeaderboardEntryDTO[]; total: number }>
}
