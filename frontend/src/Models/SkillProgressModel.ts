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

/*Leagues, mirrored from backend/src/entities/league-mapping.ts. The pool M is the tier's
maximum elo pool (200 / 150 / 120) - the lower leagues hand out more points per game.*/
export interface LeagueProfile {
    name: string;
    difficulty: [number, number, number];
    questionCount: number;
    pool: number;
}