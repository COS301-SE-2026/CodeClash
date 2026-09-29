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

function outcomes(games: GameSample[]): QuestionOutcome[] {
    const result: QuestionOutcome[] = [];
    for (const game of games.slice(0, MASTERY_WINDOW)) {
        for (const question of game.questions) {
            if (question.correct === undefined) continue;
            const clockLeft = question.ratios.time ?? 0;
            result.push({
                correct: question.correct,
                firstTry: question.correct && (question.attempts ?? 1) <= 1,
                answered: question.correct || (question.attempts ?? 0) > 0 || clockLeft > 0,
                clockLeft
            });
        }
    }
    return result;
}

function masterySeries(games: GameSample[], league: string): number[] {
    const ceiling = masteryCeiling(league);
    return games
        .slice(0, MASTERY_WINDOW)
        .map(game => (ceiling === 0 ? 0 : (gameMastery(game).mastery / ceiling) * 100))
        .reverse();
}

function difficultyInsights(bands: DifficultyBand[]): Insight[] {
    const usable = bands.filter(band => band.questionCount >= T.minBandQuestions);
    const insights: Insight[] = [];

    let worstDrop = 0;
    let cliff: [DifficultyBand, DifficultyBand] | null = null;
    for (let index = 1; index < usable.length; index++) {
        const drop = pct(usable[index - 1]!.performance) - pct(usable[index]!.performance);
        if (drop > worstDrop) {
            worstDrop = drop;
            cliff = [usable[index - 1]!, usable[index]!];
        }
    }

    if (cliff && worstDrop >= T.difficultyCliff) {
        const [easier, harder] = cliff;
        const harderName = harder.label.split(' ')[0];
        insights.push({
            id: 'difficulty-cliff',
            tone: 'warn',
            title: `${harderName} questions are where your games slip away`,
            body: `You score ${pct(easier.performance)}% of optimal one band down but only ${pct(harder.performance)}% at ${harderName}. That ${worstDrop} point drop costs more mastery than anything else, because harder questions carry more weight.`,
            action: `Spend your next few games attempting every ${harderName} question instead of skipping it - even a slow correct answer scores more than an easy one.`,
            evidence: [
                { label: easier.label, value: `${pct(easier.performance)}%` },
                { label: harder.label, value: `${pct(harder.performance)}%` },
                { label: 'Questions', value: `${easier.questionCount + harder.questionCount}` }
            ],
            score: 100 + worstDrop
        });
    }

    const hardest = bands[bands.length - 1];
    if (hardest && hardest.questionCount >= T.minBandQuestions && pct(hardest.performance) >= T.hardBandReady) {
        insights.push({
            id: 'hard-ready',
            tone: 'good',
            title: `You are handling the hardest questions at ${pct(hardest.performance)}%`,
            body: 'Your top difficulty band is as strong as your easy ones. The league is not stretching you much any more.',
            action: 'Keep climbing Elo - promotion brings harder questions, and that is where mastery grows fastest.',
            evidence: [
                { label: hardest.label, value: `${pct(hardest.performance)}%` },
                { label: 'Questions', value: `${hardest.questionCount}` }
            ],
            score: 40 + pct(hardest.performance) - T.hardBandReady
        });
    }

    return insights;
}

function attemptInsights(games: GameSample[]): Insight[] {
    const results = outcomes(games);
    if (results.length < T.minOutcomeQuestions) return [];

    const insights: Insight[] = [];
    const correctRate = pct(results.filter(result => result.correct).length / results.length);
    const firstTryRate = pct(results.filter(result => result.firstTry).length / results.length);
    const retryGap = correctRate - firstTryRate;

    if (retryGap >= T.retryGap) {
        insights.push({
            id: 'first-try',
            tone: 'warn',
            title: 'You get there - just not on the first try',
            body: `${correctRate}% of your questions end correct, but only ${firstTryRate}% are right first time. Every retry burns clock and life.`,
            action: 'Before you submit, re-read the question once and check your answer against it. One extra check is cheaper than a wrong submission.',
            evidence: [
                { label: 'Correct', value: `${correctRate}%` },
                { label: 'First try', value: `${firstTryRate}%` },
                { label: 'Questions', value: `${results.length}` }
            ],
            score: 100 + retryGap
        });
    }

    const answered = results.filter(result => result.answered);
    const unansweredShare = pct((results.length - answered.length) / results.length);
    if (unansweredShare >= T.unansweredShare) {
        insights.push({
            id: 'unanswered',
            tone: 'warn',
            title: `${unansweredShare}% of questions never get an answer`,
            body: 'Unanswered questions score zero and count against your mastery just like wrong ones.',
            action: 'Put an answer down on every question - move on from one you are stuck on and come back if the clock allows.',
            evidence: [
                { label: 'Unanswered', value: `${results.length - answered.length} of ${results.length}` }
            ],
            score: 100 + unansweredShare
        });
    }

    if (answered.length >= T.minOutcomeQuestions) {
        const clockLeft = pct(answered.reduce((total, result) => total + result.clockLeft, 0) / answered.length);
        const answeredCorrect = pct(answered.filter(result => result.correct).length / answered.length);

        if (clockLeft >= T.quickClock && answeredCorrect < T.carelessAccuracy) {
            insights.push({
                id: 'careless',
                tone: 'warn',
                title: 'Fast, but it is costing you marks',
                body: `You answer with ${clockLeft}% of the clock still left, but only ${answeredCorrect}% of those answers are right. You have time to spare that is not being used.`,
                action: 'Use half of the spare clock to check your working. Accuracy moves mastery more than the time bonus does.',
                evidence: [
                    { label: 'Clock left', value: `${clockLeft}%` },
                    { label: 'Correct', value: `${answeredCorrect}%` }
                ],
                score: 100 + (T.carelessAccuracy - answeredCorrect)
            });
        } else if (clockLeft < T.slowClock && answeredCorrect >= T.carefulAccuracy) {
            insights.push({
                id: 'careful',
                tone: 'info',
                title: 'Accurate, but close to the buzzer',
                body: `${answeredCorrect}% of your answers are right, but you only have ${clockLeft}% of the clock left when you submit. The time component is where your easy points are.`,
                action: 'Trust your first method more often - your accuracy says you can afford to answer sooner.',
                evidence: [
                    { label: 'Correct', value: `${answeredCorrect}%` },
                    { label: 'Clock left', value: `${clockLeft}%` }
                ],
                score: 60 + (T.slowClock - clockLeft)
            });
        }
    }

    return insights;
}