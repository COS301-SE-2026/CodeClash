import type { Player } from "src/Models/MatchModel";
import type { PlayerStandingDTO } from "../tournaments/tournament.dto";

export type MatchType = 'ranked' | 'casual' | 'tournament';
export type MatchMode = 'math' | 'programming';
export type MatchStatus = 'waiting' | 'starting' | 'in_progress' | 'completed' | 'abandoned';

export interface PlayerDTO {
    id: string,
    elo: number,
    username?: string,
    life?: number,
    avatar?: string,
    league?: string
}


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
    answer_format?: typeof AnswerFormat,
    templates?: TemplateDTO[]
}


export interface TemplateDTO {
    language: string,
    judge0_language_id: number,
    starter_code: string
}


export interface MatchDTO {
    match_id: string
    players: (Player | PlayerStandingDTO)[]
    duration: number
    rounds: RoundDTO[]
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
