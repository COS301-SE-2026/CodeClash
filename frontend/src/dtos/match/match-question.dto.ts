export const QuestionInputType = {
    multiple_choice: "multiple_choice",
    selection: "selection",
    short_text: "short_text",
    long_text: "long_text",
    code: "code"
} as const;

export type QuestionInputType = typeof QuestionInputType[keyof typeof QuestionInputType];

export const AnswerFormat = {
    Numeric: "numeric",
    Decimal: "decimal",
    Set: "set",
    Variables: "variables",
    Expression: "expression",
    Simplified: "simplified",
    Factored: "factored",
    Equation: "equation"
} as const;

export interface QuestionDTO {
    id?: string,
    difficulty?: string,
    title?: string,
    description?: string,
    time_limit?: string,
    input_type: typeof QuestionInputType
    answer_format?: typeof AnswerFormat
}

export interface MatchDTO {
    id: string
    players: string[]
    duration: number
    questions: QuestionDTO[]
}

export interface MatchQuestionsDTO {
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}

export interface RoundDTO {
    round_number: number,
    questions: QuestionDTO[]
}