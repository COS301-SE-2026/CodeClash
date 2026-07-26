
import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface SocketContextValue {
    socket: Socket | null
    isConnected: boolean
    matched: boolean
}

export const SocketContext = createContext<SocketContextValue | null>(null);
