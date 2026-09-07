import { GameMode, GameType } from "../../entities/db-entities/questions.entities";

import { QuestionDTO } from "./question.dto";

export interface GameDataDTO {
    pair_id: string,
    username: string,
    league: string,
    game_mode: GameMode,
    avatar?: string
    game_type: GameType
}

export interface GameQuestionsDTO {
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