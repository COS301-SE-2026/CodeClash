import type { Socket } from "socket.io-client";
import type { MatchType } from "src/dtos/match/match.dto";


export const endGame = (game_id: number, game_type: MatchType,socket: Socket | null) => {
    if (!socket) return;

    socket.emit('game_done',game_id, game_type);
}