export interface IMatchRepository {
    createMatch(
        players: string[],
        match_type: 'ranked' | 'casual',
        game_mode: 'math' | 'programming',
        match_start: Date
    ): Promise<string>;

    completeMatch(
        match_id: string,
        status: 'completed' | 'abandoned'
    ): Promise<void>;
}