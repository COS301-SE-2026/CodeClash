

/* MATCH ENTITY */

// Player Component holds array of ids for a match
export interface PlayersComponent {
    players: Map<string, number>    // <player_id, player_entity>
}

// Match Components stores data about the match
export interface MatchComponent {
    title: string,
    status: string,
    game_mode: string,
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

/********************************** */

/** PLAYER ENTITY */

// Life Components store current and total life a player has

export interface LifeComponent {
    current_life: number,
    max_life: number
}

export interface PlayerInfoComponent {
    id: string,
    username: string,
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
    player_id: string,
    question_id: string,
    attempt_number: number,
    answer: string,
    language?: string
    submitted_at: Date,
    correct:boolean
}

/********************************** */

/** RESULT ENTITY */

export interface MathsResultComponent {
    player_id: number,
    submission_id: number,
    correct: boolean
}


// union for all components - for the map

export type PlayerComponentTypes = LifeComponent | PlayerInfoComponent | RankComponent | BadgeComponent;
export type MatchComponentTypes = PlayersComponent | MatchComponent | SubmissionRegistryComponent;
export type ResultComponentTypes = MathsResultComponent;

export type Component =
    PlayerComponentTypes |
    MatchComponentTypes |
    RoundComponent |
    SubmissionComponent |
    ResultComponentTypes ;

