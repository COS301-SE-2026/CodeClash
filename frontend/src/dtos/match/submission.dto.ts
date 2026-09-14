
export type MatchType = 'ranked' | 'casual';

export type MatchMode = 'math' | 'programming';

export interface SubmissionResultDTO {
    player_id: string,
    result: boolean,
    life_update: number
}

export interface SubmissionDto {
    match_id: string,
    player_id: string,
    question_id: string,
    match_type: MatchType,
    match_mode: MatchMode
}

export interface MathsSubmissionDTO extends SubmissionDto {
    answer: string
}

export interface ProgSubmissionDTO extends SubmissionDto {
    source_code: string,
    language_id: number,
    stdin: string | null,
}


