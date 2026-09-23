export type MatchType = 'ranked' | 'casual';
export type MatchMode = 'math' | 'programming';
export type MatchStatus = 'waiting'|'starting'|'in_progress'|'completed'|'abandoned';

export interface PlayerDTO {
    id: string,
    elo: number,
    username?: string,
    life?: number
}

