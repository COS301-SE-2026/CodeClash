import { MatchMode, MatchType } from "src/entities/dtos/matches/match.dto";

export interface MatchmakingUserDTO{
    id: string;
    elo: number;
    joined_at: Date;
    match_mode: MatchMode;
    match_type: MatchType;
    match_attempt: number;
}


