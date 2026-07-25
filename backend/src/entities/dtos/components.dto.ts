import { GameMode } from "../db-entities/questions.entities"

export interface PlayerDTO {
    id: string,
    username: string,
    elo: number
}

export interface MatchDTO {
    title: string,
    status: string,
    game_mode: GameMode,
    difficulty: number,
    winner: number,
    start_time: Date,
    end_time: Date
}

export interface RoundDTO {
    question_ids: string[],
}


export interface SubmissionDTO {
    player_id: string,
    question_id: string,
    answer: string
}