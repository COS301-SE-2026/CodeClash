import type { Socket } from "socket.io-client";


export const endGame = (player_id:string,socket: Socket | null ) => {
    if(!socket) return;

    socket.emit('game_done', player_id); 
}