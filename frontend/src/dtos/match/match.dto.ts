export type MatchType = 'ranked' | 'casual';
export type MatchMode = 'math' | 'programming';

export interface PlayerDTO {
    id: string,
    elo: number,
    username?: string,
    life?: number
}