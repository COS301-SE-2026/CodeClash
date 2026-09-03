export interface QuestionDTO {
    id: string,
    category: string,
    difficulty: number,
    title: string,
    description: string,
    time_limit: string
}


export interface StartQuestionDTO {
    match_id: number
    question: string,
    question_number:number
}

