import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchType, MatchMode } from "src/dtos/match/match.dto";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { MatchmakingContext } from "./MatchmakingContextValue";

export const MatchmakingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [matchMode, setMatchMode] = useState<MatchMode | null>(null)
    const [matchType, setMatchType] = useState<MatchType | null>(null);
    const [groupId, setGroupId] = useState('');
    const [matched, setMatched] = useState(false);
    const [matchedUsers, setMatchedUsers] = useState<MatchedUsersDTO | null>(null);
    const { matchmakingSocket } = useSocket()

    const handleMatched = (data: MatchedUsersDTO) => {
        setMatched(true)
        setGroupId(data.group_id);
        setMatchedUsers(data);
        setMatchMode(data.match_mode);
        setMatchType(data.match_type);
    }

    const reset = () => {
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
        groupId,
        matched,
        setMatchType,
        setMatchMode,
        setMatched,
        reset
    }), [matchMode, matchType, groupId, matched, setMatchType])

    return (
        <MatchmakingContext.Provider
            value={value}
        >
            {children}
        </MatchmakingContext.Provider>
    )

}