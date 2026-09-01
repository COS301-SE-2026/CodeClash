import { EloDTO, EloUpdateResultDTO } from "src/entities/dtos/elo.dto"
import { LeaderboardEntryDTO } from "src/entities/dtos/leaderboard.dto"

import { RankDTO } from "src/entities/dtos/rank.dto"

export interface IEloRepository {
    // Create
    createUserElo(user_id: string): Promise<void>

    // Read
    getElo(user_id: string): Promise<EloDTO | null>
    getUsersElo(user_ids: string[]): Promise<EloDTO[] | null>
    updateRatingsAfterMatch(
        match_id: string,
        winner_id: string,
        loser_id: string
    ): Promise<{ winner: EloUpdateResultDTO; loser: EloUpdateResultDTO }>;
    getLeaderboard(limit: number, offset: number): Promise<{ data: LeaderboardEntryDTO[]; total: number }>
    getUserRank(user_id: string): Promise<RankDTO | null>;

}
