
export interface UserDTO {
    user_id?: string,
    username?: string,
    cognito_id?: string,
    email?: string,
    avatar_id?: number,
    league?: string,
    current_streak?: number,
    winning_streak?: number,
}

export const STATS: (keyof UserDTO)[] = [
    'current_streak',
    'winning_streak',
    'avatar_id',
    'league',
    'username',
    'email'
];
