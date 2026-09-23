import type { RoundDTO } from "../match/match.dto";
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

export interface PlayerStandingDTO {
    player_id: string,
    username: string,
    position: number,
    correct: number,
    total_time: number,
    eliminated: boolean
}

export interface TournamentStandingsDTO{
    tournament_id: string,
    round: number,
    standings: PlayerStandingDTO[]
}