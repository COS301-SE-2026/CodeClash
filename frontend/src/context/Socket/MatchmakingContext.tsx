

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchType, MatchMode } from "src/dtos/match/match.dto";
import { useSocket } from "./hooks/useSocket";
import { MatchmakingContext } from "./MatchmakingContextValue";

export const MatchmakingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [match_mode, set_match_mode] = useState<MatchMode | null>(null)
    const [gameType, setGameType] = useState<MatchType | null>(null);
    const [pairId, setPairId] = useState('');
    const [matched, setMatched] = useState(false);
    const [matchedUsers, setMatchedUsers] = useState<MatchedUsersDTO | null>(null);
    const { matchmaking_socket } = useSocket()

    const handleMatched = (data: MatchedUsersDTO) => {
        setMatched(true)
        setPairId(data.pair_id);
        setMatchedUsers(data);
    }


    useEffect(() => {
        if (matchmaking_socket) {
            matchmaking_socket.matched(handleMatched);
        }
    }, [matchmaking_socket])



    const value = useMemo(() => ({
        matchedUsers,
        match_mode,
        gameType,
        pairId,
        matched,
        setGameType,
        set_match_mode,
        setMatched
    }), [match_mode, gameType, pairId, matched, setGameType])

    return (
        <MatchmakingContext.Provider
            value={value}
        >
            {children}
        </MatchmakingContext.Provider>
    )

}