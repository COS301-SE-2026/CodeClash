

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { Socket } from "socket.io-client";
import type { MatchedUsersDTO } from "src/dtos/matched-user.dto";
import type { MatchmakingUserDTO, GameType, GameMode, MatchAcceptedDTO } from "src/dtos/matchmaking.dto";

import { useSocket } from "./hooks/useSocket";
import { MatchmakingContext } from "./MatchmakingContextValue";

export const MatchmakingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [gameMode, setGameMode] = useState<GameMode>(null)
    const [gameType, setGameType] = useState<GameType>(null);
    const [pairId, setPairId] = useState('');
    const [matched, setMatched] = useState(false);
    const [matchedUsers, setMatchedUsers] = useState<MatchedUsersDTO | null>(null);
    const { socket } = useSocket()

    const handleMatched = (data: MatchedUsersDTO) => {
        setMatched(true)
        setPairId(data.pair_id);
        setMatchedUsers(data);
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

    const matchAccepted = (socket: Socket, data: MatchAcceptedDTO) => {
        socket.emit("match_accepted", data)
    }

    const matchDeclined = (socket: Socket, pair_id: string) => {
        socket.emit("match_declined", pair_id);
    }


    const value = useMemo(() => ({
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
        matchedUsers,
        setMatched
    }), [gameMode, gameType, pairId, matched, setGameType])

    return (
        <MatchmakingContext.Provider
            value={value}
        >
            {children}
        </MatchmakingContext.Provider>
    )

}