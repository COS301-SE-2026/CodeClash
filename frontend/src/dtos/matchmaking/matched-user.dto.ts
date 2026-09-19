import type { MatchMode, PlayerDTO } from "src/dtos/match/match.dto"

export interface MatchedUsersDTO {
    players:PlayerDTO[],
    group_id: string,
    match_mode: MatchMode
} 