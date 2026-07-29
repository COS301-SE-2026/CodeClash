import type { GameMode, GameType } from "./matchmaking.dto"

export interface MatchedUserDTO {
    game_mode: GameMode,
    game_type: GameType
    pair_id: string,
    p1_elo: number,
    p2_elo: number
} 