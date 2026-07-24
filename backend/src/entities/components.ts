

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
    player_id: number,
    round_id: number,
    question_id: number,
    attempt_number: number,
    answer: string,
    language: string
    status: string,
    submitted_at: Date
}

/********************************** */

/** RESULT ENTITY */

export interface MathsResultComponent {
    player_id: number,
    submission_id: number,
    correct: boolean
}

/** QUESTION ENTITY */

export interface MathsQuestionComponent {
    answer: string,
    question: string
}

export interface ProgQuestionComponent {
    question: string,
    test_cases: string[],
    expected_output: string[]
}


// union for all components - for the map

export type PlayerComponentTypes = LifeComponent | PlayerInfoComponent | RankComponent | BadgeComponent;
export type MatchComponentTypes = PlayersComponent | MatchComponent;
export type ResultComponentTypes = MathsResultComponent;
export type QuestionComponentTypes = MathsQuestionComponent | ProgQuestionComponent;

export type Component =
    PlayerComponentTypes |
    MatchComponentTypes |
    RoundComponent |
    SubmissionComponent |
    ResultComponentTypes |
    QuestionComponentTypes;

