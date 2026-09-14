import type { MatchMode, MatchType } from "../match/match.dto";

export interface MatchmakingUserDTO {
    elo: number;
    match_mode: MatchMode;
    match_type: MatchType;
    username: string;
};


export interface MatchAcceptedDTO {
    pair_id: string;
    match_mode: MatchMode;
    league: string;
    username: string;
    avatar: string;
    match_type: MatchType;
}
