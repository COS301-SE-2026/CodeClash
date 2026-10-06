import type { Socket } from "socket.io-client";
import type { MatchDTO, PlayerDTO, MatchMode } from "src/dtos/match/match.dto";
import { emit, on } from "../dispatch";
import type { PlayerStandingDTO, TournamentDTO } from "src/dtos/tournaments/tournament.dto";

export class TournamentSocket {
    private readonly socket: Socket;
    constructor(socket: Socket) {
        this.socket = socket;
    }

    /************************************** LISTENERS ******************************************* */

    playerJoined(handler: (data: { player: PlayerDTO, tournament_id: string }) => void) {
        return on<{ player: PlayerDTO, tournament_id: string }>(this.socket, 'player_joined', handler);
    }

    playerLeft(handler: (data: { player: PlayerDTO, tournament_id: string }) => void) {
        return on<{ player: PlayerDTO, tournament_id: string }>(this.socket, 'player_left', handler);
    }

    tournamentCreated(handler: (tournament: TournamentDTO) => void) {
        return on<TournamentDTO>(this.socket, 'tournament_created', handler);
    }


    tournamentCancelled(handler: () => void) {
        return on(this.socket, 'tournament_cancelled', handler);
    }

    tournamentStart(handler: (data: { match: MatchDTO, tournament: TournamentDTO }) => void) {
        return on(this.socket, 'tournament_started', handler);
    }


    tournamentRemoved(handler: (data: { tournament_id: string }) => void) {
        return on<{ tournament_id: string }>(this.socket, 'tournament_removed', handler);
    }

    tournamentEnded(handler: (data: { tournament_id: string }) => void) {
        return on<{ tournament_id: string }>(this.socket, 'tournament_ended', handler);
    }

    playerEliminated(handler: (player: PlayerStandingDTO) => void) {
        return on<PlayerStandingDTO>(this.socket, 'player_eliminated', handler);
    }

    // Error events
    joinFailed(handler: (data: Error) => void) {
        return on<Error>(this.socket, 'join_tournament_failed', handler);
    }

    leaveFailed(handler: (data: Error) => void) {
        return on<Error>(this.socket, 'leave_tournament_failed', handler);
    }

    createFailed(handler: (data: Error) => void) {
        return on<Error>(this.socket, 'host_tournament_failed', handler);
    }

    cancelFailed(handler: (data: Error) => void) {
        return on<Error>(this.socket, 'cancel_tournament_failed', handler);
    }




    /************************************** EMITTERS ******************************************* */

    joinTournament(data: { tournament_id: string, player: PlayerDTO }) {
        return emit<typeof data, void>(this.socket, 'join_tournament', data);
    }

    leaveTournament(data: { tournament_id: string, player: PlayerDTO }) {
        return emit<typeof data, void>(this.socket, 'leave_tournament', data);
    }

    hostTournament(data: { match_mode: MatchMode, host: PlayerDTO, title: string, min_players: number }) {
        return emit<typeof data, TournamentDTO>(this.socket, 'host_tournament', data);
    }

    cancelTournament(tournament_id: string) {
        return emit<string, void>(this.socket, 'cancel_tournament', tournament_id);
    }

    getTournament(tournament_id: string) {
        return emit<string, TournamentDTO>(this.socket, 'get_tournament', tournament_id);
    }

    startTournament(data: { tournament_id: string, league: string }) {
        return emit<typeof data, { match: MatchDTO, tournament: TournamentDTO }>(this.socket, 'start_tournament', data);
    }

    identity() {
        return emit<void, { user_id: string }>(this.socket, 'identity', undefined);
    }

    getStandings(tournament_id: string) {
        return emit<string, PlayerStandingDTO[]>(this.socket, 'get_standings', tournament_id);
    }

    completeRound(tournament_id: string) {
        return emit<string, PlayerStandingDTO>(this.socket, 'complete_round', tournament_id);
    }

    endTournament(data: { tournament_id: string, match_id: string }) {
        return emit<typeof data, void>(this.socket, 'end_tournament', data);
    }
}
