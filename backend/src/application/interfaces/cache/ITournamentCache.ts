import { TournamentDTO } from "src/entities/dtos/tournaments/tournaments.dto";
import { MatchMode } from "src/entities/dtos/match/match.dto";
import { PlayerDTO } from "src/entities/dtos/components.dto";

export interface ITournamentCache {
    createTournament(tournament_id: string, start_date: Date, match_mode: MatchMode): Promise<void>,
    addPlayer(tournament_id: string, player: PlayerDTO): Promise<void>,
    removePlayer(tournament_id: string, player_id: string): Promise<void>,
    getTournament(tournament_id: string): Promise<TournamentDTO | null>,
    deleteTournament(tournament_id: string): Promise<void>
}