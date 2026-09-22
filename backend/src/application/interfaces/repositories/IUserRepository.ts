import { EloUpdateResultDTO } from "src/entities/dtos/users/elo.dto";
import { UserDTO } from "src/entities/dtos/users/user.dto"
import { LeaderboardEntryDTO } from "src/entities/dtos/match/leaderboard.dto";
import { RankDTO } from "src/entities/dtos/users/rank.dto";

export interface IUserRepository {
    createUser(username: string, email: string, cognito_id: string, avatar_id: number, league: string): Promise<UserDTO | null>,
    getUser(user_id: string): Promise<UserDTO | null>,
    getUsers(user_ids: string[]): Promise<UserDTO[] | null>,
    getAllUsers(): Promise<UserDTO[] | null>,
    getUserId(cognito_id: string): Promise<UserDTO | null>,
    getUserData(user_id: string, stat: keyof UserDTO): Promise<UserDTO | null>,
    searchByUsername(query: string): Promise<UserDTO[]>,
    updateStreaks(user_id: string, won: boolean): Promise<void>,
    getTotalStats(user_id: string): Promise<{ total_wins: number; total_matches: number; winning_streak: number; league: string }>,
    updateRatingsAfterMatch(winner_id: string, loser_id: string): Promise<{ winner: EloUpdateResultDTO, loser: EloUpdateResultDTO }>,
    updateEloAfterTournament(results: { user_id: string, placement: number }[]): Promise<EloUpdateResultDTO[]>,
    getLeaderboard(limit: number, offset: number): Promise<{ data: LeaderboardEntryDTO[]; total: number }>
     getUserRank(userId: string): Promise<RankDTO | null>
}
