
export interface UserDTO {
    user_id?: string,
    username?: string,
    cognito_id?: string,
    email?: string,
    league?: string,
    current_streak?: number,
    winning_streak?: number,
    elo?: number
}

export const STATS: (keyof UserDTO)[] = [
    'current_streak',
    'winning_streak',
    'league',
    'username',
    'email',
    'elo'
];
