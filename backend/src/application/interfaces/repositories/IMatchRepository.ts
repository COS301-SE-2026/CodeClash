export interface IMatchRepository {
    createMatch(
        player1_id: string,
        player2_id: string,
        mode: 'ranked' | 'casual',
        match_start: Date
    ): Promise<string>;

    completeMatch(
        match_id: string,
        status: 'completed' | 'abandoned'
    ): Promise<string>;
}