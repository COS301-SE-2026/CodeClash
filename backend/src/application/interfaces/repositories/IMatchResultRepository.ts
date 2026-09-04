import { MatchResultDTO } from '../../../interface-adapters/dtos/match-result.dto';

export interface IMatchResultRepository {
    buildMatchResult(match_id: string): Promise<MatchResultDTO>;
    saveMatchLog(
        match_id: string,
        winner_id: string,
        loser_id: string,
        elo_gained: number | null,
        elo_lost: number | null
    ): Promise<void>;

    getUserDetails(user_id: string): Promise<{ username: string; avatar: number }>;
}