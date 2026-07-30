import { GameMode, GameType } from "../db-entities/questions.entities"

export interface PlayerDTO {
    id: string,
    elo: number,
    avatar?:string,
    life?:number,
    username?:string,
    done?:boolean
}

export interface MatchDTO {
    title: string,
    status: string,
    game_mode: GameMode,
    match_type: GameType,
    difficulty: number,
    winner: number,
    start_time: Date,
    end_time: Date
}

export interface RoundDTO {
    question_ids: string[],
}


export interface SubmissionDTO {
    match_id: number,
    player_id: string,
    question_id: string,
    answer: string
    question_number?: number
}