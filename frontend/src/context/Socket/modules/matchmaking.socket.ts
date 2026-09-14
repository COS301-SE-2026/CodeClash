import type { Socket } from "socket.io-client";
import type { MatchAcceptedDTO, MatchmakingUserDTO } from "src/dtos/matchmaking/matchmaking.dto";
import { on, emit } from "../dispatch";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";

export class MatchmakingSocket {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    /************************************** LISTENERS ******************************************* */

    matched(handler: (data: MatchedUsersDTO) => void) {
        return on<MatchedUsersDTO>(this.socket, 'users_matched', handler);
    }

    matchReady(handler: (match_id: string)=>void){
        return on<string>(this.socket, 'game_ready', handler);
    }

    declineDone(handler: ()=>void){
        return on(this.socket, 'decline_done', handler);
    }

    gameDeclined(handler: ()=>void){
        return on(this.socket, 'game_declined', handler);
    }

    startMatch(handler: (match_id: string)=>void){
        return on(this.socket, 'start_game', handler);
    }

    /************************************** EMITTERS ******************************************* */


    joinQueue(data: MatchmakingUserDTO) {
        return emit<MatchmakingUserDTO, void>(this.socket, 'join_match_queue', data);
    }

    leaveQueue() {
        return emit(this.socket, 'leave_match_queue');
    }

    acceptMatch(data: MatchAcceptedDTO) {
        return emit<MatchAcceptedDTO, void>(this.socket, 'match_accepted', data);
    }

    declineMatch(pair_id: string) {
        return emit<string, void>(this.socket, 'match_declined', pair_id);
    }
}