import type { Socket } from "socket.io-client";


export const endGame = (game_id: number, socket: Socket | null) => {
    if (!socket) return;

    socket.emit('game_done',game_id);
}