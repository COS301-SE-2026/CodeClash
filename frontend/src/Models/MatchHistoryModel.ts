import type{MatchMode, MatchType } from "src/dtos/match/match.dto";

export type MatchResult = 'WIN' | 'LOSS' | 'DRAW';


export interface MatchDetails {
    score: string;
    totalTime: string;
    numCorrect: number;
    date: string;
    time: string;
}

export interface MatchRow {
    id: string;
    mode: MatchMode;
    type: MatchType;
    timestamp: string;
    result: MatchResult;
    details: MatchDetails | null;
}

