import type { Socket } from "socket.io-client";
import type { GameType } from "src/dtos/matchmaking.dto";


export const endGame = (game_id: number, game_type: GameType,socket: Socket | null) => {
    if (!socket) return;

    socket.emit('game_done',game_id, game_type);
}