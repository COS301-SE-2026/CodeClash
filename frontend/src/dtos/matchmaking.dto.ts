export interface MatchmakingUserDTO {
    elo: number;
    game_mode: GameMode;
    game_type: GameType,
    username: string
};


export interface MatchAcceptedDTO {
    pair_id: string;
    game_mode: GameMode;
    league: string,
    username: string
    avatar: string,
    game_type: GameType
}

export type GameMode = 'math' | 'programming' | null
export type GameType = 'ranked' | 'casual' | null