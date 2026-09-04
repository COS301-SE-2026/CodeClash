<<<<<<< HEAD:backend/src/entities/dtos/question.dto.ts
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

=======
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
    question: string
}

>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4:backend/src/interface-adapters/dtos/question.dto.ts
