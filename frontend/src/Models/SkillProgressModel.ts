// this is where all the math and logic of the skill progress system will lie, all formulas based on the skill progress
// and elo calculation doc

export type SkillDomain = 'overall' | 'math' | 'programming';
export type GameDomain = Exclude<SkillDomain, 'overall'>;
export type MatchOutcome = 'WIN' | 'LOSS' | 'DRAW';

export type ComponentKey = 'time' | 'accuracy' | 'speed' | 'timeCx' | 'spaceCx';

export interface ComponentDefinition {
    key: ComponentKey;
    label: string;
    domain: GameDomain;

    //    sum to 1, so weight_k = fraction_k * M and sum_k weight_k = M as the doc requires.*/
    fraction: number;
    hint: string;
// true because mock for now, but otherwise will be non deterministic innit
    estimated?: boolean;
}

export const COMPONENTS: ComponentDefinition[] = [
    {
        key: 'time',
        label: 'Time',
        domain: 'math',
        fraction: 0.55,
        hint: 'How much of the question clock you had left when you answered.'
    },
    {
        key: 'accuracy',
        label: 'Accuracy',
        domain: 'math',
        fraction: 0.45,
        hint: 'Correct answers against submissions made.'
    },
    {
        key: 'time',
        label: 'Time',
        domain: 'programming',
        fraction: 80 / 150, // 80 elo points of the 150 pool, straight from the doc
        hint: 'How much of the question clock you had left when you submitted.'
    },
    {
        key: 'speed',
        label: 'Speed (ms)',
        domain: 'programming',
        fraction: 30 / 150,
        hint: 'Judge0 wall clock runtime of the accepted submission.'
    },
    {
        key: 'timeCx',
        label: 'Time Cx',
        domain: 'programming',
        fraction: 25 / 150,
        hint: 'How close your time complexity sits to the optimal solution.',
        estimated: true
    },
    {
        key: 'spaceCx',
        label: 'Space Cx',
        domain: 'programming',
        fraction: 15 / 150,
        hint: 'How close your space complexity sits to the optimal solution.',
        estimated: true
    }
];

export const componentsFor = (domain: GameDomain): ComponentDefinition[] =>
    COMPONENTS.filter(component => component.domain === domain);

// league logic stuff
export interface LeagueProfile {
    name: string;
    difficulty: [number, number, number];
    questionCount: number;
    pool: number;
}

export const LEAGUES: LeagueProfile[] = [
    { name: 'Mercury', difficulty: [1, 2, 3], questionCount: 5, pool: 200 },
    { name: 'Venus', difficulty: [4, 5, 6], questionCount: 10, pool: 200 },
    { name: 'Earth', difficulty: [7, 8, 9], questionCount: 15, pool: 200 },
    { name: 'Mars', difficulty: [10, 11, 12], questionCount: 20, pool: 150 },
    { name: 'Jupiter', difficulty: [13, 14, 15], questionCount: 25, pool: 150 },
    { name: 'Saturn', difficulty: [16, 17, 18], questionCount: 30, pool: 150 },
    { name: 'Uranus', difficulty: [19, 20, 21], questionCount: 35, pool: 120 },
    { name: 'Neptune', difficulty: [22, 23, 24], questionCount: 40, pool: 120 }
];

export const DIFFICULTY_CEILING = 24;

export function leagueProfile(league: string | undefined): LeagueProfile {
    const found = LEAGUES.find(entry => entry.name.toLowerCase() === (league ?? '').toLowerCase());
    return found ?? LEAGUES[0]!;
}

// highest mastery that a player can reach fr from a perfect game on the league's hardest questions
export function masteryCeiling(league: string | undefined): number {
    return leagueProfile(league).difficulty[2];
}

// single quesiton in game n stuff
export interface QuestionSample {
    difficulty: number;
    ratios: Partial<Record<ComponentKey, number>>;
}

export interface GameSample {
    matchId: string;
    playedAt: string; // ISO timestamp
    domain: GameDomain;
    league: string;
    result: MatchOutcome;
    questions: QuestionSample[];
    // for per question telemetries and game mastery calculations
    simulated: boolean;
}

export interface GameMastery {
    matchId: string;
    playedAt: string;
    domain: GameDomain;
    result: MatchOutcome;
    // 1 - 24 skale game master
    mastery: number;
    // Game level performance fraction f = Score / M, in [0, 1]
    performance: number;
    averageDifficulty: number;
    questionCount: number;
    simulated: boolean;
}

export const MASTERY_WINDOW = 20; // games, per the doc
export const GROWTH_WINDOW_DAYS = 30;
/*Weekly growth smaller than this either way is reported as flat rather than a trend.*/
export const GROWTH_FLAT_THRESHOLD = 0.05;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));


