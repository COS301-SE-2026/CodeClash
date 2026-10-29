import type { MatchMode, MatchType } from "./match.dto"

export interface ProgFeedbackDTO {
  test_number: number;
  total_tests: number;
  status_id: number;
  verdict: string;
  input: string;
  expected_output: string;
  actual_output: string | null;
  error: string | null
}

export interface MarkingResultDTO {
    player_id: string,
    correct: boolean,
    speed: number,
    attempt_number: number,
  life_update: number,
  feedback?: ProgFeedbackDTO
}

export interface SubmissionDTO {
    id: string,
    player_id: string,
    question_id: string,
    round_number: number,
    question_number: number,
    match_type: MatchType,
    match_mode: MatchMode,
    tournament_id?:string,
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

