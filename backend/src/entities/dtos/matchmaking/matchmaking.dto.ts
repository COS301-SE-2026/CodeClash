import { MatchMode } from "../../database/questions.entities";

export interface MatchmakingUserDTO{
    id: string;
    elo: number;
    joined_at: Date;
    match_mode: MatchMode;
    match_attempt: number;
}


