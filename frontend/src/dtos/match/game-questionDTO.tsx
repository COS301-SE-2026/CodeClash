export interface QuestionDTO {
    id?: string,
    difficulty?: number,
    title?: string,
    description?: string,
    time_limit?: string
}

export interface MatchDTO {
    id: string
    players: string[]
    duration: number
    questions: QuestionDTO[]
}

export interface GameQuestionsDTO {
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}
