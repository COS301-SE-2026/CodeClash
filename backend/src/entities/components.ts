

/* MATCH ENTITY */

import { GameType } from "./db-entities/questions.entities"
import { MathsSubmissionDTO, ProgSubmissionDTO } from "./dtos/components.dto"

// Player Component holds array of ids for a match
export interface PlayersComponent {
    players: Map<string, number>    // <player_id, player_entity>
}

// Match Components stores data about the match
export interface MatchComponent {
    title: string,
    status: string,
    game_mode: string,
    match_type: GameType
    difficulty: number,
    winner: number,
    rounds: number[],
    start_time: Date,
    end_time: Date,
    question_number: number,
}

// SubmissionRegistryComponent maps player_id-question_id -> submission entity

export interface SubmissionRegistryComponent{
    submissions: Map<string, number>
}


// Result component 
export interface ResultComponent{
    winner: {
        id: string,
        elo: number
    },
    loser: {
        id: string,
        elo: number
    }
    stats: Record<string, {num_correct: number, total_time:number}>
}

/********************************** */

/** PLAYER ENTITY */

// Life Components store current and total life a player has

export interface LifeComponent {
    current_life: number,
    max_life: number
}

export interface PlayerInfoComponent {
    id: string,
    elo: number
}

// Rank Components stores the players rank,elo, league and streaks
export interface RankComponent {
    rank: number,
    league: string
}

// Badge Component stores player achievements
export interface BadgeComponent {
    achievement_id: number,
    unlocked_at: Date
}

/********************************** */

/** ROUND ENTITY */

export interface RoundComponent {
    question_ids: string[],
    question_number: number
}

/********************************** */

/** SUBMISSION ENTITY */

export interface SubmissionComponent {
    match_id: number,
    player_id: string,
    question_id: string,
    question_number: number,
    started_at: Date,
    attempt_number: number,
    answer: MathsSubmissionDTO | ProgSubmissionDTO | null,
    language?: string
    submitted_at: Date | null,
    correct:boolean | null,
    token: string | undefined
}

/********************************** */




// union for all components - for the map

export type PlayerComponentTypes = LifeComponent | PlayerInfoComponent | RankComponent | BadgeComponent;
export type MatchComponentTypes = PlayersComponent | MatchComponent | SubmissionRegistryComponent |ResultComponent;

export type Component =
    PlayerComponentTypes |
    MatchComponentTypes |
    RoundComponent |
    SubmissionComponent 

