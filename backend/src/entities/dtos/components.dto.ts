import { MatchMode, MatchType } from "src/entities/dtos/match/match.dto"
import { QuestionDTO } from "./match/question.dto"

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
    match_mode: MatchMode,
    match_type: MatchType,
    difficulty: number,
    winner: number,
    start_time: Date,
    end_time: Date
}

export interface RoundDTO {
    questions: QuestionDTO[],
}


export interface MathsSubmissionDTO{
    answer: string
}

export interface ProgSubmissionDTO{
    source_code: string,
    language_id: number,
    stdin: string|null,
}

export interface PlayerSubmissionDTO{
    match_id: number,
    player_id: string,
    question_id: string,
    round_id: string,
    question_number?: number,
    submission: MathsSubmissionDTO | ProgSubmissionDTO | null
}