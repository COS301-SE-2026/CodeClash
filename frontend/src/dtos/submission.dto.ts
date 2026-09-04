
export interface SubmissionResultDTO {
    player_id: string,
    result: boolean,
    life_update: number
}

export interface MathsSubmissionDTO {
    answer: string
}

export interface ProgSubmissionDTO {
    source_code: string,
    language_id: number,
    stdin: string | null,
}