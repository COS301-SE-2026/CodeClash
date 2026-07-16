

/* MATCH ENTITY */

// Player Component holds array of ids for a match
export interface Players_Component {
    player_ids: number[]
}

// Match Components stores data about the match
export interface Match_Component {
    title: string,
    status: string,
    game_mode: string,
    difficulty: string,
    winnder: number
}

/********************************** */

/** PLAYER ENTITY */

// Life Components store current and total life a player has

export interface Life_Component {
    current_life: number,
    max_life: number
}

// Rank Components stores the players rank,elo, league and streaks
export interface Rank_Component {
    rank: number,
    elo: number,
    league: string,
    current_streak: number,
    winning_streak: number,
}

// Badge Component stores player achievements
export interface Badge_Component {
    achievement_id: number,
    unlocked_at: Date
}

/********************************** */

/** ROUND ENTITY */

export interface Round_Component {
    match_id: number,
    questions_ids: number,
    start_time: Date,
    end_time: Date,
    question_number: number
}

/********************************** */

/** SUBMISSION ENTITY */

export interface Submission_Component {
    player_id: number,
    round_id: number,
    question_id: number,
    attempt_number: number,
    answer: string,
    language: string
    status: string,
    submitted_at: Date
}


// union for all components - for the map

export type PlayerComponentTypes = Life_Component | Rank_Component | Badge_Component;
export type MatchComponentTypes = Players_Component | Match_Component;

export type Component =
    PlayerComponentTypes |
    MatchComponentTypes |
    Round_Component |
    Submission_Component;

