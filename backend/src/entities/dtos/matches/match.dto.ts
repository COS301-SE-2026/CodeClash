import { QuestionDTO } from "../questions/question.dto"

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

export enum MatchMode {
    Maths = "math",
    Programming = "programming"
}

export enum MatchType{
    ranked = 'ranked',
    casual = 'casual'
}

export interface PlayerMatchStats{
    user_id: string,
    num_correct: number,
    
}

