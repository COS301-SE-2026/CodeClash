import { createContext } from "react";
import type { Socket } from "socket.io-client";
import type { MatchedUsersDTO } from "src/dtos/matched-user.dto";
import type { GameMode, GameType, MatchmakingUserDTO } from "src/dtos/matchmaking.dto";


export interface MatchmakingContextValue {
    matchedUsers: MatchedUsersDTO | null,
    gameMode: GameMode,
    gameType: GameType,
    pairId: string,
    matched: boolean,
    setGameMode: (mode: GameMode)=>void,
    setGameType: (type: GameType)=>void,
    joinMatchQueue: (socket: Socket, data: MatchmakingUserDTO) => void,
    leaveMatchQueue: (socket: Socket) => void,
    matchAccepted: (socket: Socket, data: {}) => void,
    matchDeclined: (socket: Socket, pair_id: string) => void
}

export const MatchmakingContext = createContext<MatchmakingContextValue | null>(null);