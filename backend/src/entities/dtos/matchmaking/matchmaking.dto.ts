import { MatchMode } from "src/entities/dtos/match/match.dto";

export interface MatchmakingUserDTO{
    id: string;
    elo: number;
    joined_at: Date;
    match_mode: MatchMode;
    match_attempt: number;
}


