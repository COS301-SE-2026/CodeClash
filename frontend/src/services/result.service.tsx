import type { Socket } from "socket.io-client";


export const endGame = (game_id: number, socket: Socket | null, pair_id: string) => {
    if (!socket) return;

    socket.emit('game_done', pair_id,game_id);
}