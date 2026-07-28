
import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface SocketContextValue {
    socket: Socket | null
    isConnected: boolean
    matched: {game_mode: string, pair_id:string} | null
}

export const SocketContext = createContext<SocketContextValue | null>(null);
