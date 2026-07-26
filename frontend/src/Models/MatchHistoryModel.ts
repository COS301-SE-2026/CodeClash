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

export interface MatchRow {
    id: string;
    mode: MatchMode;
    type: MatchType;
    timestamp: string;
    result: MatchResult;
    details: MatchDetails;
}

export const mockedMatch: MatchRow[] = [
    {
        id: '1',
        mode: 'CASUAL',
        type: 'PROGRAMMING',
        timestamp: '2H 30M AGO',
        result: 'WIN',
        details: {
            results: '3-2',
            matchLength: '05:00',
            questions: [
                {
                    label: 'QUESTION 1',
                    speed: '00:22',
                    accuracy: '90%',
                    correctness: true,
                },
            ],
            date: 'JULY 26, 2026',
            time: '10:25 - 10:28',
        },
    },
];