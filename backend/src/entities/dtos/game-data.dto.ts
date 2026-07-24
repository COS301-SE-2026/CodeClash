import { GameMode } from "../db-entities/questions.entities";
import { PlayerDTO } from "./components.dto";
import { QuestionDTO } from "./question.dto";



export interface GameDataDTO {
    pair_id: string,
    players: PlayerDTO[]
    usernames: string[],
    league: string,
    game_mode: GameMode
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