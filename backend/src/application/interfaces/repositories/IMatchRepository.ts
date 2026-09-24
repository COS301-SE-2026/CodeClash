import { MatchMode, MatchPlayer, MatchStatus, MatchType } from "src/entities/dtos/matches/match.dto";
import { MatchHistoryRow } from "src/entities/dtos/matches/match.dto";
import { MatchResultDTO } from "src/entities/dtos/matches/match.dto";

export interface IMatchRepository {
    createMatch(players: string[], match_type: MatchType, match_mode: MatchMode, match_start: Date): Promise<string>,
    completeMatch(match_id: string, status: MatchStatus): Promise<void>,
    updatePlayers(match_id: string, players: MatchPlayer[]): Promise<void>,
    getMatchHistory(user_id: string): Promise<MatchHistoryRow[]>,
    buildMatchResult(match_id: string): Promise<MatchResultDTO>
}