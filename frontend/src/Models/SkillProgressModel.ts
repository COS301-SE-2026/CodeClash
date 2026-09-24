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