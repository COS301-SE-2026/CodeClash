import { QuestionDTO } from "./question.dto"

export interface MatchDataDTO {
    group_id: string,
    username: string,
    league: string,
    match_mode: MatchMode,
    avatar?: string
    match_type: MatchType
}

export interface MatchQuestionArrays {
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}

export enum MatchMode {
    Maths = "math",
    Programming = "programming"
}

export enum MatchType {
    ranked = 'ranked',
    casual = 'casual'
}

export enum MatchStatus{
    Waiting = "waiting",
    Starting = "starting",
    In_progress = "in_progress",
    Completed = "completed",
    Abandoned = "abandoned"
}

export interface MatchPlayer {
    id: string,
    position: number,
    elo_change: number,
    num_correct: number,
    total_time: number
}

export interface MatchQuestion {
    id: string,
    answer_time: number,
    attempt_number: number
}

export interface MatchPowerUps {
    powerup_id: string,
    user_id: string,
    used_at: Date
}