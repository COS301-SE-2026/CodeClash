import type { Socket } from "socket.io-client";
import type { MatchAcceptedDTO, MatchmakingUserDTO } from "src/dtos/matchmaking/matchmaking.dto";
import { on } from "../dispatch";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";

export class MatchmakingSocket {
    private readonly socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    /************************************** LISTENERS ******************************************* */

    matched(handler: (data: MatchedUsersDTO) => void) {
        return on<MatchedUsersDTO>(this.socket, 'users_matched', handler);
    }

    matchReady(handler: (match_id: string) => void) {
        return on<string>(this.socket, 'game_ready', handler);
    }


    gameDeclined(handler: () => void) {
        return on(this.socket, 'match_declined', handler);
    }


    /************************************** EMITTERS ******************************************* */


    joinQueue(data: MatchmakingUserDTO) {
        // return emit<MatchmakingUserDTO, void>(this.socket, 'join_match_queue', data);
        this.socket.emit('join_match_queue', data);
    }

    leaveQueue() {
        this.socket.emit('leave_match_queue');
    }

    acceptMatch(data: MatchAcceptedDTO) {
        this.socket.emit('match_accepted', data);
    }

    declineMatch(data: { group_id: string, match_mode: string }) {
        this.socket.emit('decline_match', data);
    }
}