import { createContext } from "react";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchType, MatchMode } from "src/dtos/match/match.dto";

export interface MatchmakingContextValue {
    matchedUsers: MatchedUsersDTO | null,
    match_mode: MatchMode | null,
    gameType: MatchType | null,
    pairId: string,
    matched: boolean,
    set_match_mode: (mode: MatchMode) => void,
    setGameType: (type: MatchType|null) => void,
    setMatched: (matched: boolean) => void
}

export const MatchmakingContext = createContext<MatchmakingContextValue | null>(null);