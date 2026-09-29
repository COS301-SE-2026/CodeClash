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

function domainGapInsight(allGames: GameSample[], league: string): Insight[] {
    const ceiling = masteryCeiling(league);
    if (ceiling === 0) return [];

    const summarise = (domain: GameDomain) => {
        const games = allGames.filter(game => game.domain === domain).slice(0, MASTERY_WINDOW);
        const mastery = games.length === 0 ? 0 : games.reduce((total, game) => total + gameMastery(game).mastery, 0) / games.length;
        return { domain, games: games.length, share: Math.round((mastery / ceiling) * 100) };
    };

    const math = summarise('math');
    const programming = summarise('programming');
    if (math.games < T.minDomainGames || programming.games < T.minDomainGames) return [];

    const gap = Math.abs(math.share - programming.share);
    if (gap < T.domainGap) return [];

    const weaker = math.share < programming.share ? math : programming;
    const stronger = weaker === math ? programming : math;
    return [{
        id: 'domain-gap',
        tone: 'warn',
        title: `${domainName(weaker.domain)} is ${gap} points behind ${domainName(stronger.domain)}`,
        body: `Your ${domainName(stronger.domain).toLowerCase()} mastery sits at ${stronger.share}% of the league ceiling, ${domainName(weaker.domain).toLowerCase()} at ${weaker.share}%.`,
        action: `Queue ${domainName(weaker.domain).toLowerCase()} for your next few ranked games - the weaker side has the most room to move your overall mastery.`,
        evidence: [
            { label: domainName(stronger.domain), value: `${stronger.share}%` },
            { label: domainName(weaker.domain), value: `${weaker.share}%` },
            { label: 'Games', value: `${stronger.games} / ${weaker.games}` }
        ],
        score: 100 + gap
    }];
}

function componentTrendInsights(games: GameSample[], domains: GameDomain[]): Insight[] {
    const moves: { component: ComponentScore; delta: number; series: number[] }[] = [];

    for (const domain of domains) {
        const inDomain = games.filter(game => game.domain === domain);
        if (inDomain.length < T.trendHalf * 2) continue;

        const recent = componentScores(inDomain.slice(0, T.trendHalf), domain, T.trendHalf);
        const earlier = componentScores(inDomain.slice(T.trendHalf, T.trendHalf * 2), domain, T.trendHalf);

        recent.forEach((component, index) => {
            const before = earlier[index]!;
            if (!component.inMastery || component.gamesCounted === 0 || before.gamesCounted === 0) return;
            const series = inDomain
                .slice(0, T.trendHalf * 2)
                .map(game => componentScores([game], domain, 1)[index]!.value)
                .reverse();
            moves.push({ component, delta: component.value - before.value, series });
        });
    }

    if (moves.length === 0) return [];

    const insights: Insight[] = [];
    const best = moves.reduce((high, move) => (move.delta > high.delta ? move : high), moves[0]!);
    const worst = moves.reduce((low, move) => (move.delta < low.delta ? move : low), moves[0]!);
    const name = (move: typeof best) => `${move.component.label} · ${domainName(move.component.domain)}`;

    if (best.delta >= T.componentMove) {
        insights.push({
            id: 'most-improved',
            tone: 'good',
            title: `Most improved: ${name(best)}, up ${best.delta} points`,
            body: `Your last ${T.trendHalf} games average ${best.component.value}% here, against ${best.component.value - best.delta}% in the ${T.trendHalf} before.`,
            action: 'Whatever you changed here is working - keep doing it while you fix the weaker areas.',
            evidence: [
                { label: `Last ${T.trendHalf}`, value: `${best.component.value}%` },
                { label: `Previous ${T.trendHalf}`, value: `${best.component.value - best.delta}%` }
            ],
            series: best.series,
            score: 50 + best.delta
        });
    }

    if (worst.delta <= -T.componentMove) {
        insights.push({
            id: 'slipping',
            tone: 'warn',
            title: `${name(worst)} is slipping, down ${Math.abs(worst.delta)} points`,
            body: `Your last ${T.trendHalf} games average ${worst.component.value}% here, against ${worst.component.value - worst.delta}% in the ${T.trendHalf} before.`,
            action: COMPONENT_ACTION[worst.component.key],
            evidence: [
                { label: `Last ${T.trendHalf}`, value: `${worst.component.value}%` },
                { label: `Previous ${T.trendHalf}`, value: `${worst.component.value - worst.delta}%` }
            ],
            series: worst.series,
            score: 100 + Math.abs(worst.delta)
        });
    }

    return insights;
}

function consistencyInsight(games: GameSample[], league: string): Insight[] {
    const series = masterySeries(games, league);
    if (series.length < T.minConsistencyGames) return [];

    const mean = series.reduce((total, value) => total + value, 0) / series.length;
    const spread = Math.round(Math.sqrt(series.reduce((total, value) => total + (value - mean) ** 2, 0) / series.length));
    const best = Math.round(Math.max(...series));
    const worst = Math.round(Math.min(...series));

    if (spread >= T.streaky) {
        return [{
            id: 'streaky',
            tone: 'warn',
            title: 'Your games swing a lot from one to the next',
            body: `Per game mastery ranges from ${worst}% to ${best}% of the ceiling, with a typical swing of ${spread} points. Raising your floor moves the average faster than raising your peak.`,
            action: 'Look at your weakest recent games in Match History - the same question type usually shows up in the bad ones.',
            evidence: [
                { label: 'Best game', value: `${best}%` },
                { label: 'Worst game', value: `${worst}%` },
                { label: 'Typical swing', value: `±${spread}` }
            ],
            series,
            score: 80 + spread
        }];
    }

    if (spread <= T.steady) {
        return [{
            id: 'steady',
            tone: 'good',
            title: 'You are remarkably consistent',
            body: `Your per game mastery stays within about ${spread} points of ${Math.round(mean)}%. You rarely have an off game.`,
            action: 'Consistency is the base to build on - push the difficulty and let the average rise.',
            evidence: [
                { label: 'Average', value: `${Math.round(mean)}%` },
                { label: 'Typical swing', value: `±${spread}` }
            ],
            series,
            score: 30
        }];
    }

    return [];
}

function weakestComponentInsight(components: ComponentScore[]): Insight[] {
    const scored = components.filter(component => component.inMastery && component.gamesCounted > 0);
    if (scored.length === 0) return [];

    const weakest = scored.reduce((low, component) => (component.value < low.value ? component : low), scored[0]!);
    const strongest = scored.reduce((high, component) => (component.value > high.value ? component : high), scored[0]!);

    const needsWork = weakest.value < T.weakComponent;
    const insights: Insight[] = [{
        id: 'weakest',
        tone: needsWork ? 'warn' : 'info',
        title: `${weakest.label} · ${domainName(weakest.domain)} is your weakest component at ${weakest.value}%`,
        body: `${weakest.hint} Averaged over ${plural(weakest.gamesCounted, 'game')}.`,
        action: COMPONENT_ACTION[weakest.key],
        evidence: [
            { label: 'Weakest', value: `${weakest.value}%` },
            { label: 'Target', value: `${T.weakComponent}%` },
            { label: 'Games', value: `${weakest.gamesCounted}` }
        ],
        score: needsWork ? 70 + (100 - weakest.value) / 2 : 12
    }];

    if ((strongest.key !== weakest.key || strongest.domain !== weakest.domain) && strongest.value >= T.weakComponent) {
        insights.push({
            id: 'strongest',
            tone: 'good',
            title: `${strongest.label} · ${domainName(strongest.domain)} is carrying you at ${strongest.value}%`,
            body: 'Keep it there and spend your practice time on the weaker components.',
            evidence: [{ label: 'Games', value: `${strongest.gamesCounted}` }],
            score: 20
        });
    }

    return insights;
}

function runtimeInsight(games: GameSample[], components: ComponentScore[]): Insight[] {
    const speed = components.find(component => component.domain === 'programming' && component.key === 'speed');
    const programmingGames = games.filter(game => game.domain === 'programming').length;
    if (!speed || speed.gamesCounted < T.minDomainGames || speed.value >= T.slowRuntime) return [];

    return [{
        id: 'runtime',
        tone: 'warn',
        title: `Your code works, but runs slow - ${speed.value}% on runtime`,
        body: `Judge0 runtime is scored against the fastest known solution. Across ${plural(programmingGames, 'programming game')} your submissions land well behind it.`,
        action: COMPONENT_ACTION.speed,
        evidence: [
            { label: 'Runtime score', value: `${speed.value}%` },
            { label: 'Games', value: `${speed.gamesCounted}` }
        ],
        score: 90 + (T.slowRuntime - speed.value)
    }];
}

function growthInsight(growth: GrowthResult): Insight[] {
    const series = growth.readings.map(reading => reading.mastery);
    const peak = Math.max(1, ...series);
    const scaled = series.map(value => (value / peak) * 100);

    if (growth.readings.length < 2) {
        return [{
            id: 'growth-thin',
            tone: 'info',
            title: 'Not enough readings for a trend yet',
            body: `Growth needs a few games inside the ${growth.windowDays} day window before the line means anything.`,
            evidence: [{ label: 'Readings', value: `${growth.readings.length}` }],
            score: 5
        }];
    }
    if (growth.growth > GROWTH_FLAT_THRESHOLD) {
        return [{
            id: 'growth-up',
            tone: 'good',
            title: `Mastery is climbing ${growth.growth.toFixed(2)} points a week`,
            body: `The trend line over the last ${growth.windowDays} days is pointing up. Whatever you changed, keep doing it.`,
            evidence: [
                { label: 'Per week', value: `+${growth.growth.toFixed(2)}` },
                { label: 'Fit', value: `${pct(growth.fit)}%` }
            ],
            series: scaled,
            score: 45
        }];
    }
    if (growth.growth < -GROWTH_FLAT_THRESHOLD) {
        return [{
            id: 'growth-down',
            tone: 'warn',
            title: `Mastery is sliding ${Math.abs(growth.growth).toFixed(2)} points a week`,
            body: `Your recent games are scoring below your earlier ones in the last ${growth.windowDays} days.`,
            action: 'Check the slipping component and difficulty cards above - the slide usually starts in one of them.',
            evidence: [
                { label: 'Per week', value: growth.growth.toFixed(2) },
                { label: 'Fit', value: `${pct(growth.fit)}%` }
            ],
            series: scaled,
            score: 85
        }];
    }
    return [{
        id: 'growth-flat',
        tone: 'info',
        title: 'Mastery is holding flat',
        body: `Your last ${growth.windowDays} days sit on a level trend line. Harder questions are the usual way to move it.`,
        evidence: [{ label: 'Per week', value: growth.growth.toFixed(2) }],
        series: scaled,
        score: 15
    }];
}

function leagueInsights(mastery: number, league: string, winRate: number, gameCount: number): Insight[] {
    const ceiling = masteryCeiling(league);
    if (ceiling === 0 || gameCount === 0) return [];

    const share = Math.round((mastery / ceiling) * 100);
    const insights: Insight[] = [];

    if (share >= T.promotionReady) {
        insights.push({
            id: 'promotion',
            tone: 'good',
            title: `You are outgrowing ${league || 'this league'}`,
            body: `Your mastery is at ${share}% of what ${league || 'this league'} can measure. Expect a dip on promotion - the questions get harder before you do.`,
            action: 'Win the ranked games that get you promoted; the harder league is where your mastery can keep growing.',
            evidence: [{ label: 'Of league ceiling', value: `${share}%` }],
            score: 55
        });
    } else {
        insights.push({
            id: 'league-room',
            tone: 'info',
            title: `You are at ${share}% of what ${league || 'this league'} can measure`,
            body: `Mastery is scored against ${league || 'your league'} difficulty, capped at ${ceiling.toFixed(0)}. You are at ${share}% of that ceiling. It measures your own progress, not other players.`,
            evidence: [{ label: 'Of league ceiling', value: `${share}%` }],
            score: 10
        });
    }

    const gap = winRate - share;
    if (gameCount >= T.minConsistencyGames && Math.abs(gap) >= T.winMasteryGap) {
        const winningAhead = gap > 0;
        insights.push({
            id: 'win-vs-mastery',
            tone: 'info',
            title: winningAhead ? 'You win more than your mastery suggests' : 'You play better than your results show',
            body: winningAhead
                ? `You win ${winRate}% of games while mastery sits at ${share}% of the ceiling - you are beating opponents without maxing the questions. Stronger opponents will close that gap.`
                : `Mastery sits at ${share}% of the ceiling but you only win ${winRate}% of games. Your answers are good; your opponents are just a little quicker.`,
            action: winningAhead
                ? 'Aim for full marks, not just the win - mastery is what carries into the next league.'
                : 'Shave time off your answers - the time component is what decides close games.',
            evidence: [
                { label: 'Win rate', value: `${winRate}%` },
                { label: 'Mastery', value: `${share}%` }
            ],
            score: 35 + Math.abs(gap) / 2
        });
    }

    return insights;
}

function practiceInsight(practice?: PracticeSummary): Insight[] {
    if (!practice || practice.games === 0) return [];
    const percentage = practice.questions === 0 ? 0 : pct(practice.correct / practice.questions);
    return [{
        id: 'practice',
        tone: 'info',
        title: `${plural(practice.games, 'practice game')}, ${percentage}% correct`,
        body: 'Casual games are kept out of your mastery and growth, so practise freely.',
        evidence: [{ label: 'Questions', value: `${practice.questions}` }],
        score: 8
    }];
}