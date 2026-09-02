
export interface CompleteSubmissionResult {
    question_id: string,
    correct: boolean | null,
    speed: string,
    token?: string
}

export interface PendingSubmissionResult{
    token: string
}

export type SubmissionResult = CompleteSubmissionResult | PendingSubmissionResult
