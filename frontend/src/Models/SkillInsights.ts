// main engine for the skill insights aspects of the skill dashboard
import type {
  ComponentKey,
  ComponentScore,
  DifficultyBand,
  GameDomain,
  GameSample,
  GrowthResult,
  PracticeSummary
} from './SkillProgressModel';

import {
  GROWTH_FLAT_THRESHOLD,
  MASTERY_WINDOW,
  componentScores,
  componentsFor,
  gameMastery,
  masteryCeiling
} from './SkillProgressModel'; // both imports but the difference between type import and normal import and also dont want one singular to be the entire import statement

export type InsightTone = 'good' | 'warn' | 'info';

export interface InsightEvidence {
  label: string;
  value: string;
}

export interface Insight {
  id: string;
      tone: InsightTone;
      title: string; // what are the numbers representing
      body: string; // what the user should do about it
      action?: string;
      evidence: InsightEvidence[]; // collecting of the evidence of data needed for this to work properl
      series?: number[];
      score: number;
}

export interface WeeklyChange {
  key: string;
      label: string;
      domain: GameDomain;
      delta: number; // the change init
      current: number;
}

export interface FocusReport {
  focus: Insight | null;
  supporting: Insight[];
  more: Insight[];
  weekly: WeeklyChange[];
}

export interface InsightInput {
    games: GameSample[];
    allGames: GameSample[];
    components: ComponentScore[];
    bands: DifficultyBand[];
    growth: GrowthResult;
    mastery: number;
    league: string;
    winRate: number;
    practice?: PracticeSummary;
    now?: Date;
}

export const INSIGHT_THRESHOLDS = {
    // a band needs this many questions before it can speak
    minBandQuestions: 5,
    // drop between neighbouring bands that counts as a cliff
    difficultyCliff: 20,
    // hardest band performance that says the player is ready for more
    hardBandReady: 70,
    // questions with a recorded outcome before first try and pace insights show - one Mercury game
    minOutcomeQuestions: 5,
    // correct rate minus first try rate that counts as needing retries
    retryGap: 15,
    // clock left (0-100) above which answers count as quick
    quickClock: 50,
    // clock left below which answers count as slow
    slowClock: 25,
    // correct rate below which quick answers count as careless
    carelessAccuracy: 60,
    // correct rate above which slow answers count as accurate
    carefulAccuracy: 75,
    // share of questions never answered that counts as running out of clock
    unansweredShare: 15,
    // games per domain before the domain gap is compared
    minDomainGames: 3,
    // mastery gap, as a share of the league ceiling, that counts as a real gap
    domainGap: 15,
    // games in each half before component trends are compared
    trendHalf: 5,
    // component change between halves that counts as a real move
    componentMove: 7,
    // games before consistency is judged
    minConsistencyGames: 7,
    // spread of per game mastery (share of ceiling) that counts as streaky
    streaky: 15,
    // spread at or below this counts as consistent
    steady: 6,
    // mastery share of ceiling that says the league is nearly outgrown
    promotionReady: 75,
    // a component below this is worth fixing; above it the weakest is just the least strong
    weakComponent: 65,
    // programming runtime component below this counts as slow code
    slowRuntime: 50,
    // gap between win rate and mastery share that is worth pointing out
    winMasteryGap: 25,
    weekDays: 7
} as const;

const T = INSIGHT_THRESHOLDS;
const DAY_MS = 24 * 60 * 60 * 1000;

const pct = (value: number): number => Math.round(value * 100);
const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;
const domainName = (domain: GameDomain): string => (domain === 'math' ? 'Maths' : 'Programming');

const COMPONENT_ACTION: Record<ComponentKey, string> = {
    time: 'Answer sooner: skim the question for what it asks, commit to a method, and check once rather than twice.',
    accuracy: 'Slow down on the final step - most dropped marks come from the last line, not the method.',
    speed: 'Your submissions are correct but slow to run. Swap nested loops for a map or a sort before you submit.',
    timeCx: 'Before coding, name the complexity you are aiming for and check your loops against it.',
    spaceCx: 'Look for structures you build and never reuse - most extra memory comes from copies.'
};

interface QuestionOutcome {
    correct: boolean;
    firstTry: boolean;
    answered: boolean;
    clockLeft: number;
}