export interface IMatchRepository {
    createMatch(
        players: string[],
        mode: 'ranked' | 'casual',
        match_start: Date
    ): Promise<string>;

    completeMatch(
        match_id: string,
        status: 'completed' | 'abandoned'
    ): Promise<void>;
}