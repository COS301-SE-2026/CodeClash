

export interface IGameCache{
    saveGame(game_id: number, player_ids: string[], question_ids: string[]): Promise<void>;
    saveAnswer(question_id: string, answer: string): Promise<void>;
}