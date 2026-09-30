import type { MatchMode, MatchType } from "../match/match.dto";

export interface MatchmakingUserDTO {
    elo: number;
    match_mode: MatchMode;
    match_type: MatchType;
};


export interface MatchAcceptedDTO {
    group_id: string;
    match_mode: MatchMode;
    league: string;
    username: string;
    avatar: string;
    match_type: MatchType;
}
