import type { Socket } from "socket.io-client";
import type { PlayerDTO } from "src/dtos/match/match.dto";
import { emit } from "../dispatch";
import type { MatchMode } from "src/dtos/match/match.dto";
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto";

export class TournamentSocket {
    private readonly socket: Socket;
    constructor(socket: Socket) {
        this.socket = socket;
    }

    /************************************** LISTENERS ******************************************* */



    /************************************** EMITTERS ******************************************* */

    joinTournament(data: { tournament_id: string, player: PlayerDTO }) {
        return emit<typeof data, void>(this.socket, 'join_tournament', data);
    }

    leaveTournament(data: { tournament_id: string, player: PlayerDTO }) {
        return emit<typeof data, void>(this.socket, 'leave_tournament', data);
    }

    hostTournament(data: { start_date: Date, match_mode: MatchMode }) {
        return emit<typeof data, TournamentDTO>(this.socket, 'host_tournament', data);
    }

    cancelTournament(tournament_id: string) {
        return emit<string, void>(this.socket, 'cancel_tournament', tournament_id);
    }
}