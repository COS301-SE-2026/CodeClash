import { GameMode } from "../db-entities/questions.entities";

export interface GameDataDTO{
    pair_id:string,
    player_ids: string[],
    league: string,
    game_mode: GameMode,
    question_number: number
}