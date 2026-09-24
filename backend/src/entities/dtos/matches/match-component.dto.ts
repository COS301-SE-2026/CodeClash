import { MatchMode, MatchType } from "src/entities/dtos/matches/match.dto"
import { QuestionDTO } from "../questions/question.dto"

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
    winner: number,
    start_time: Date,
    end_time: Date
}

export interface RoundDTO {
    questions: QuestionDTO[]
}