import { MatchStatus, MatchType } from "src/entities/dtos/match/match.dto";
import { MatchHistoryRow } from "src/entities/dtos/match/match.dto";
import { MatchResultDTO } from "src/entities/dtos/match/match.dto";

export interface IMatchRepository {
    createMatch(players: string[], match_type: MatchType, game_mode: 'math' | 'programming', match_start: Date): Promise<string>,
    completeMatch(match_id: string, status: MatchStatus): Promise<void>,
    getMatchHistory(user_id: string): Promise<MatchHistoryRow[]>,
    buildMatchResult(match_id: string): Promise<MatchResultDTO>
}