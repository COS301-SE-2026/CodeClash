export interface QuestionDTO {
    question_id?: string,
    difficulty?: number,
    title?: string,
    description?: string,
    time_limit?: string
}

export interface MatchDTO {
    id: string
    player_1: string   //username
    player_2: string
    duration: number
    questions: QuestionDTO[]
}

export interface GameQuestionsDTO {
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}
