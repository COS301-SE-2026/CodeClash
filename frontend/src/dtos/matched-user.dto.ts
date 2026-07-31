import type { GameMode } from "./matchmaking.dto"


export interface PlayerDTO {
    id: string,
    elo: number,
    username?:string
}

export interface MatchedUsersDTO {
    players: {
        player_1: PlayerDTO,
        player_2: PlayerDTO,
        
    }
    pair_id: string,
    game_mode: GameMode
} 