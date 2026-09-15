import type { MatchMode, PlayerDTO } from "src/dtos/match/match.dto"

export interface MatchedUsersDTO {
    players: {
        player_1: PlayerDTO,
        player_2: PlayerDTO,

    }
    pair_id: string,
    game_mode: MatchMode
} 