import { GameMode } from "../db-entities/questions.entities";
import { QuestionDTO } from "./question.dto";



export interface GameDataDTO {
    pair_id: string,
    players: string[],
    elos: number[],
    league: string,
    game_mode: GameMode,
    question_number: number
}

export interface GameQuestionsDTO {
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}

export interface SubmissionDTO {
    math_id: number,
    question_id: string,
    answer: string
}