

import React, { useEffect, useState, type ReactNode } from "react";
import { MatchmakingContext } from "./MatchmakingContextValue";
import type { MatchmakingUserDTO, GameType, GameMode } from "src/dtos/matchmaking.dto";
import { Socket } from "socket.io-client";
import { useSocket } from "./hooks/useSocket";


export const MatchmakingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [gameMode, setGameMode] = useState<GameMode>(null)
    const [gameType, setGameType] = useState<GameType>(null);
    const [pairId, setPairId] = useState('');
    const [matched, setMatched] = useState(false);
    const { socket } = useSocket()

    const handleMatched = (pair_id: string) => {
        setMatched(true)
        setPairId(pair_id);
    }


    useEffect(() => {
        if (socket) {
            socket.on('users_matched', handleMatched)
        }
    }, [socket])

    const joinMatchQueue = (socket: Socket, data: MatchmakingUserDTO) => {
        socket.emit("join_match_queue", data);
    }

    const leaveMatchQueue = (socket: Socket) => {
        socket.emit("leave_match_queue");
    }

    const matchAccepted = (socket: Socket, data: {}) => {
        socket.emit("match_accepted", data)
    }

    const matchDeclined = (socket: Socket, pair_id: string) => {
        socket.emit("match_declined", pair_id);
    }



    return (
        <MatchmakingContext.Provider
            value={{
                gameMode,
                gameType,
                pairId,
                matched,
                setGameType,
                setGameMode,
                joinMatchQueue,
                leaveMatchQueue,
                matchAccepted,
                matchDeclined,
            }}
        >
            {children}
        </MatchmakingContext.Provider>
    )

}