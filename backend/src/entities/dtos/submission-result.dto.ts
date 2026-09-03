
export interface ProgSubmissionResult {
    stdout: string
    time: string,
    memory: number,
    stderr: number | null,
    token: string,
    compile_output: string | null,
    message: string | null,
    status: {
        id: number,
        description: string
    },
}

export interface MathsSubmissionResult{
    correct: boolean;
}

export type SubmissionResult = ProgSubmissionResult | MathsSubmissionResult


export interface OpponentProgressDTO {
    player_id: string,
    correct: boolean,
    opponent_life: number,
    question: number
}