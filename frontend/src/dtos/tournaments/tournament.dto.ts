import type { RoundDTO } from "../match/match-question.dto";
import type { PlayerDTO } from "../match/match.dto";
import type { MatchMode, MatchStatus } from "../match/match.dto";

export interface TournamentDTO {
    tournament_id: string,
    rounds: RoundDTO[],
    players: PlayerDTO[],
    tournament_mode: MatchMode,
    status: MatchStatus,
    created_at: Date,
    start_date: Date,
}