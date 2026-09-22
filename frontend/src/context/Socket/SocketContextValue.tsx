
import { createContext } from "react";
import type { MatchSocket } from "./modules/match.socket";
import type { MatchmakingSocket } from "./modules/matchmaking.socket";

export interface SocketContextValue {
    match_socket:MatchSocket | null,
    matchmaking_socket:MatchmakingSocket|null,
    isConnected: boolean
}

export const SocketContext = createContext<SocketContextValue | null>(null);
