import { MatchMode } from "../matches/match.dto"

export interface QuestionDTO {
    id: string,
    match_mode: MatchMode,
    difficulty: number | string,
    title: string,
    description: string,
    time_limit: string,
    input_type: QuestionInputType,
    templates?: TemplateDTO[]
}


export interface TemplateDTO {
    language: string,
    judge0_language_id: number,
    starter_code: string
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