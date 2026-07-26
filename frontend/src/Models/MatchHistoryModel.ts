export type MatchMode = 'CASUAL' | 'RANKED';
export type MatchType = 'PROGRAMMING' | 'MATH';
export type MatchResult = 'WIN' | 'LOSS' | 'DRAW';

export interface QuestionStat {
    label: string;
    speed: string;
    accuracy: string;
    correctness: boolean;
}

export interface MatchDetails {
    results: string;
    matchLength: string;
    questions: QuestionStat[];
    date: string;
    time: string;
}