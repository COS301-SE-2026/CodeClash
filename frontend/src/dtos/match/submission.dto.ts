import type { MatchMode, MatchType } from "./match.dto"

export interface MarkingResultDTO {
    player_id: string,
    correct: boolean,
    speed: number,
    attempt_number: number,
    life_update: number
}

export interface SubmissionDTO {
    match_id: string,
    player_id: string,
    question_id: string,
    question_number: number,
    match_type: MatchType,
    match_mode: MatchMode,
    submission: MathsSubmissionDTO | ProgSubmissionDTO
}

export interface MathsSubmissionDTO {
    answer: string
}

export interface ProgSubmissionDTO {
    source_code: string,
    language_id: number,
    stdin: string | null,
}

