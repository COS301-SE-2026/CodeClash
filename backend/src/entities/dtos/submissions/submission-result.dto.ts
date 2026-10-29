
export interface ProgSubmissionResult {
    stdout: string | null,
    time: string,
    memory: number,
    stderr: string | null,
    token: string,
    compile_output: string | null,
    message: string | null,
    status: {
        id: number,
        description: string
    },
}

export interface ProgFeedbackDTO {
  test_number: number,
  total_tests: number,
  status_id: number,
  verdict: string,
  input: string,
  expected_output: string,
  actual_output: string | null,
  error: string | null
}

export interface MathsSubmissionResult {
    correct: boolean;
}

export type SubmissionResult = ProgSubmissionResult | MathsSubmissionResult


export interface OpponentProgressDTO {
    player_id: string,
    opponent_life: number,
    round: number,
    question: number,
}

export interface MarkingResultDTO {
    player_id: string,
    correct: boolean,
    speed: number,
    attempt_number: number,
  life_update?: number,
  feedback?: ProgFeedbackDTO
}