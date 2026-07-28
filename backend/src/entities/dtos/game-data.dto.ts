import { GameMode } from "../db-entities/questions.entities";
import { QuestionDTO } from "./question.dto";

export interface GameDataDTO{
    pair_id:string,
    player_ids: string[],
    league: string,
    game_mode: GameMode,
    question_number: number
}

export interface GameQuestionsDTO{
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}