
import { createContext } from "react";
import type { MatchSocket } from "./modules/match.socket";
import type { MatchmakingSocket } from "./modules/matchmaking.socket";
import type { TournamentSocket } from "./modules/tournament.socket";

export interface SocketContextValue {
    matchSocket: MatchSocket | null,
    matchmakingSocket: MatchmakingSocket | null,
    tournamentSocket: TournamentSocket | null,
    isConnected: boolean
}

export const SocketContext = createContext<SocketContextValue | null>(null);
