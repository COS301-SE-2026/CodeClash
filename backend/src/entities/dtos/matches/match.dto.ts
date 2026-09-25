import { QuestionDTO } from "../questions/question.dto"

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
    casual = 'casual',
    tournament = 'tournament'
}

export enum MatchStatus {
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
    total_time: number,
  elimination_round: number | null,
    league?: string,
    questions?: QuestionResult[] // it'll me for question by question analysis`
}

export interface QuestionResult {
  question_id: string,
  round_number: number,
  difficulty: number,
  time_limit_ms: number,
  correct: boolean,
  attempts: number,
  time_taken_ms: number | null,
  run_time_ms: number | null,
  memory_kb: number | null,
  time_ratio: number,
  accuracy_ratio: number | null,
  speed_ratio: number | null,
  time_cx_ratio: number | null,
  space_cx_ratio: number | null    
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

export interface MatchHistoryRow {
    match_id: string,
    match_mode: MatchMode,
    match_type: MatchType,
    match_start: Date,
    match_end: Date | null,
    position: number,
    elimination_round: number | null,
    score: {
        correct: number,
        total: number,
        time: number
    },
}

export interface PlayerResultDTO {
    user_id: string,
    username: string,
    avatar: number,
    correctness: number,// percentage 0-100
    speed: number,
    eloEffect: number,//signed 
    position: number,
    rank: number | null
}

export interface MatchResultDTO {
    match_id: string,
    players: PlayerResultDTO[]
}