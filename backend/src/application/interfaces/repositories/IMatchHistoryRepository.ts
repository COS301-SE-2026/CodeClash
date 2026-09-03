export interface MatchHistoryRow {
    match_id: string;
    mode: 'ranked' | 'casual';
    game_type: 'math' | 'programming';
    match_start: Date;
    result: 'WIN' | 'LOSS' | 'DRAW';
    score: string;
}

export interface MatchHistoryQuestionStat {
    label: string;
    correctness: boolean;
}

export interface MatchHistoryDetail extends MatchHistoryRow {
    questions: MatchHistoryQuestionStat[];
    totalTime: string; // mm:ss from total_time
}

export interface IMatchHistoryRepository{
    getMatchHistory(user_id: string): Promise<MatchHistoryRow[]>;
    getMatchDetails(match_id: string, user_id: string): Promise<MatchHistoryDetail>;
}