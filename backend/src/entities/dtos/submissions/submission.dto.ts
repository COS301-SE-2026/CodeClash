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
    round_number: number,
    question_number?: number,
    submission: MathsSubmissionDTO | ProgSubmissionDTO | null
}