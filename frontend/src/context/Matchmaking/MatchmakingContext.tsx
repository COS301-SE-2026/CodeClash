

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchType, MatchMode } from "src/dtos/match/match.dto";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { MatchmakingContext } from "./MatchmakingContextValue";

export const MatchmakingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [matchMode, setMatchMode] = useState<MatchMode | null>(null)
    const [matchType, setMatchType] = useState<MatchType | null>(null);
    const [group_id, set_group_id] = useState('');
    const [matched, setMatched] = useState(false);
    const [matchedUsers, setMatchedUsers] = useState<MatchedUsersDTO | null>(null);
    const { matchmakingSocket } = useSocket()

    const handleMatched = (data: MatchedUsersDTO) => {
        setMatched(true)
        set_group_id(data.group_id);
        setMatchedUsers(data);
        setMatchMode(data.match_mode);
    }

    const reset = ()=>{
        setMatched(false);
        setMatchedUsers(null);
    }

    useEffect(() => {
        if (matchmakingSocket) {
           
           matchmakingSocket.matched(handleMatched);
        }
    }, [matchmakingSocket])


    const value = useMemo(() => ({
        matchedUsers,
        matchMode,
        matchType,
        group_id,
        matched,
        setMatchType,
        setMatchMode,
        setMatched,
        reset
    }), [matchMode, matchType, group_id, matched, setMatchType])

    return (
        <MatchmakingContext.Provider
            value={value}
        >
            {children}
        </MatchmakingContext.Provider>
    )

}