export interface QuestionDTO {
    id: string,
    category: string,
    difficulty: number | string,
    title: string,
    description: string,
    time_limit: string,
    input_type: QuestionInputType
}

export interface StartQuestionDTO {
    match_id: number
    question: string,
    question_number: number
}

export enum QuestionInputType {
    multiple_choice = "multiple_choice",
    selection = "selection",
    short_text = "short_text",
    long_text = "long_text",
    code = "code"
}