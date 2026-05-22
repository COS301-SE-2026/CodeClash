export interface QuestionDTO {
    id: string
    title: string
    question:string
    description?: string
    difficulty: 'easy' | 'medium' | 'hard'
    language: string
}

export interface MatchDTO{
    id: string
    player_1: string   //username
    player_2: string
    duration: number
    questions: QuestionDTO[]

}
