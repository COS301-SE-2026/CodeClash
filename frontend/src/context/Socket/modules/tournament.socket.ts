import type { Socket } from "socket.io-client";
import type { PlayerDTO } from "src/dtos/match/match.dto";
import { emit, on } from "../dispatch";
import type { MatchMode } from "src/dtos/match/match.dto";
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto";

export class TournamentSocket {
    private readonly socket: Socket;
    constructor(socket: Socket) {
        this.socket = socket;
    }

    /************************************** LISTENERS ******************************************* */

    playerJoined(handler: (player: PlayerDTO) => void) {
        return on<PlayerDTO>(this.socket, 'player_joined', handler);
    }

    playerLeft(handler: (player: PlayerDTO) => void) {
        return on<PlayerDTO>(this.socket, 'player_left', handler);
    }

    tournamentCreated(handler: (tournament: TournamentDTO) => void) {
        return on<TournamentDTO>(this.socket, 'tournament_created', handler);
    }


    tournamentCancelled(handler: () => void) {
        return on(this.socket, 'tournament_cancelled', handler);
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

    hostTournament(data: { start_date: Date, match_mode: MatchMode, host: PlayerDTO }) {
        return emit<typeof data, TournamentDTO>(this.socket, 'host_tournament', data);
    }

    cancelTournament(tournament_id: string) {
        return emit<string, void>(this.socket, 'cancel_tournament', tournament_id);
    }

    getTournament(tournament_id: string){
        return emit<string, TournamentDTO>(this.socket, 'get_tournament', tournament_id);
    }
}