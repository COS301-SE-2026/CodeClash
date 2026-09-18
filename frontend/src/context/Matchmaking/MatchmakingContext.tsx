

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchType, MatchMode } from "src/dtos/match/match.dto";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { MatchmakingContext } from "./MatchmakingContextValue";
import { group } from "console";

export const MatchmakingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [match_mode, set_match_mode] = useState<MatchMode | null>(null)
    const [gameType, setGameType] = useState<MatchType | null>(null);
    const [group_id, set_group_id] = useState('');
    const [matched, setMatched] = useState(false);
    const [matchedUsers, setMatchedUsers] = useState<MatchedUsersDTO | null>(null);
    const { matchmaking_socket } = useSocket()

    const handleMatched = (data: MatchedUsersDTO) => {
        console.log("Matched: ", data);
        setMatched(true)
        set_group_id(data.group_id);
        setMatchedUsers(data);
        set_match_mode(data.match_mode);
    }

    const reset = ()=>{
        setMatched(false);
        setMatchedUsers(null);
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
        group_id,
        matched,
        setGameType,
        set_match_mode,
        setMatched,
        reset
    }), [match_mode, gameType, group, matched, setGameType])

    return (
        <MatchmakingContext.Provider
            value={value}
        >
            {children}
        </MatchmakingContext.Provider>
    )

}