import { MatchMode, MatchType } from "../database/questions.entities";

import { QuestionDTO } from "./question.dto";

export interface MatchDataDTO {
    group_id: string,
    username: string,
    league: string,
    match_mode: MatchMode,
    avatar?: string
    match_type: MatchType
}

export interface MatchQuestionsDTO {
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}
