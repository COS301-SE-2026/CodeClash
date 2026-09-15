import { MatchMode, MatchType } from "../database/questions.entities";

import { QuestionDTO } from "./question.dto";

export interface MatchDataDTO {
    pair_id: string,
    username: string,
    league: string,
    game_mode: MatchMode,
    avatar?: string
    game_type: MatchType
}

export interface MatchQuestionsDTO {
    easy: QuestionDTO[],
    medium: QuestionDTO[],
    hard: QuestionDTO[]
}


export interface MatchedPlayersDTO {
    player_1: {
        id: string,
        elo: number
    },
    player_2: {
        id: string,
        elo: number
    }
}