
export interface CompleteSubmissionResult {
    status: 'complete',
    question_id: string,
    correct: boolean | null,
    speed: string,
    token?: string,
    message?:string
}

export interface PendingSubmissionResult{
    status: 'pending',
    token: string,
    question_id: string,
}

export type SubmissionResult = CompleteSubmissionResult | PendingSubmissionResult


export interface OpponentProgressDTO{
    player_id: string,
    correct: boolean,
    opponent_life: number,
    question: number
}