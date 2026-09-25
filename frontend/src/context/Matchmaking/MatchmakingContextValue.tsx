import { createContext } from "react";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchType, MatchMode } from "src/dtos/match/match.dto";

export interface MatchmakingContextValue {
    matchedUsers: MatchedUsersDTO | null,
    matchMode: MatchMode | null,
    matchType: MatchType | null,
    group_id: string,
    matched: boolean,
    setMatchMode: (mode: MatchMode) => void,
    setMatchType: (type: MatchType | null) => void,
    setMatched: (matched: boolean) => void,
    reset: () => void
}

export const MatchmakingContext = createContext<MatchmakingContextValue | null>(null);