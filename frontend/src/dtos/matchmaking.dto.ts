
export interface MatchmakingUserDTO {
    username: string,
    elo: number;
    game_mode: GameMode;
    game_type: GameType
};

export type GameMode = 'maths' | 'programming' | null
export type GameType = 'ranked' | 'casual' | null