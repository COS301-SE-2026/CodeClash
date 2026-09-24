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
  // weekly growth based on the games and stuff
export const GROWTH_FLAT_THRESHOLD = 0.05;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));


/*(1) and (2): f_i = Score_i / M. Since the weights sum to M, the fraction is just the
weighted mean of the question's component ratios - no need to carry M around.*/
export function questionFraction(question: QuestionSample, domain: GameDomain): number {
    const definitions = componentsFor(domain);
    let weighted = 0;
    let fractionSum = 0;

    for (const definition of definitions) {
        const ratio = question.ratios[definition.key];
        if (ratio === undefined) continue;
        weighted += definition.fraction * clamp01(ratio);
        fractionSum += definition.fraction;
    }

    if (fractionSum === 0) return 0;
    return clamp01(weighted / fractionSum);
}

/* Mastery_g = 1/N * sum_i (f_i * d_i). N is every question the game offered, so
questions that were never answered count as zeros .*/
export function gameMastery(game: GameSample): GameMastery {
    const questionCount = game.questions.length;

    let masterySum = 0;
    let fractionSum = 0;
    let difficultySum = 0;

    for (const question of game.questions) {
        const fraction = questionFraction(question, game.domain);
        masterySum += fraction * question.difficulty;
        fractionSum += fraction;
        difficultySum += question.difficulty;
    }

    return {
        matchId: game.matchId,
        playedAt: game.playedAt,
        domain: game.domain,
        result: game.result,
        mastery: questionCount === 0 ? 0 : masterySum / questionCount,
        performance: questionCount === 0 ? 0 : fractionSum / questionCount,
        averageDifficulty: questionCount === 0 ? 0 : difficultySum / questionCount,
        questionCount,
        simulated: game.simulated
    };
}

/* the headline mastery score, the mean of the last 20 per game masteries. Fewer than
20 games on record just averages what we have, and the View says how many were used.*/
export function averageMastery(games: GameMastery[], window: number = MASTERY_WINDOW): number {
    const sampled = games.slice(0, window);
    if (sampled.length === 0) return 0;
    return sampled.reduce((total, game) => total + game.mastery, 0) / sampled.length;
}

export interface ComponentScore extends ComponentDefinition {
    // C_k as a percentage, 0-100
    value: number;
    gamesCounted: number;
}

/* R_k,g = 1/N_g * sum_i ratio_k,i  and  C_k = 1/20 * sum_g R_k,g, shown as a percent.*/
export function componentScores(
    games: GameSample[],
    domain: GameDomain,
    window: number = MASTERY_WINDOW
): ComponentScore[] {
    const sampled = games.filter(game => game.domain === domain).slice(0, window);

    return componentsFor(domain).map(definition => {
        let gameSum = 0;
        let gamesCounted = 0;

        for (const game of sampled) {
            const questionCount = game.questions.length;
            if (questionCount === 0) continue;

            let ratioSum = 0;
            let seen = 0;
            for (const question of game.questions) {
                const ratio = question.ratios[definition.key];
                if (ratio === undefined) continue;
                ratioSum += clamp01(ratio);
                seen += 1;
            }
            if (seen === 0) continue;

            gameSum += ratioSum / questionCount;
            gamesCounted += 1;
        }

        return {
            ...definition,
            value: gamesCounted === 0 ? 0 : Math.round((gameSum / gamesCounted) * 100),
            gamesCounted
        };
    });
}

export interface GrowthReading {
  // Day number counted from the start of the window, t_j.
    day: number;
    // Mastery observed on that reading, M_j.
    mastery: number;
    playedAt: string;
}

export interface GrowthResult {
    // Intercept a - estimated mastery at day 0.
    intercept: number;
    // Slope b - mastery gained per day.
    slope: number;
    // The displayed figure, 7b: mastery gained per week.
    growth: number;
    // How well the straight line explains the readings, 0-1. Used for a confidence note.
    fit: number;
    readings: GrowthReading[];
    windowDays: number;
}

/*Readings for the growth window: one per game inside the last 30 days, oldest first, with
its day offset from the start of the window. M_j in (6) is the Mastery Score, so each
reading is the (4) average of the 20 games up to and including that game, not the game's
own Mastery_g. Games must come in newest first.*/
export function growthReadings(
    games: GameMastery[],
    windowDays: number = GROWTH_WINDOW_DAYS,
    now: Date = new Date()
): GrowthReading[] {
  // prediction based on user stats
    const windowStart = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
    const dayMs = 24 * 60 * 60 * 1000;

    return games
        .map((game, index) => ({ game, mastery: averageMastery(games.slice(index)) }))
        .filter(({ game }) => new Date(game.playedAt).getTime() >= windowStart)
        .sort((a, b) => new Date(a.game.playedAt).getTime() - new Date(b.game.playedAt).getTime())
        .map(({ game, mastery }) => ({
            day: (new Date(game.playedAt).getTime() - windowStart) / dayMs,
            mastery,
            playedAt: game.playedAt
        }));
}

/* Ordinary least squares with one predictor. b = cov(t, M) / var(t) and
the displayed growth is 7b, mastery points per week.*/
export function growthFromReadings(
    readings: GrowthReading[],
    windowDays: number = GROWTH_WINDOW_DAYS
): GrowthResult {
    const count = readings.length;
    const empty: GrowthResult = {
        intercept: 0,
        slope: 0,
        growth: 0,
        fit: 0,
        readings,
        windowDays
    };

    if (count < 2) {
        if (count === 1) {
            return { ...empty, intercept: readings[0]!.mastery };
        }
        return empty;
    }

    const meanDay = readings.reduce((total, reading) => total + reading.day, 0) / count;
    const meanMastery = readings.reduce((total, reading) => total + reading.mastery, 0) / count;

    let covariance = 0;
    let variance = 0;
    for (const reading of readings) {
        const dayDelta = reading.day - meanDay;
        covariance += dayDelta * (reading.mastery - meanMastery);
        variance += dayDelta * dayDelta;
    }

    // Every reading landing on the same day leaves the slope undefined, so call it flat.
    if (variance === 0) {
        return { ...empty, intercept: meanMastery };
    }

    const slope = covariance / variance;
    const intercept = meanMastery - slope * meanDay;

    // r squared, so the View can say how trustworthy the trend line is.
    let residualSum = 0;
    let totalSum = 0;
    for (const reading of readings) {
        const predicted = intercept + slope * reading.day;
        residualSum += (reading.mastery - predicted) ** 2;
        totalSum += (reading.mastery - meanMastery) ** 2;
    }

    return {
        intercept,
        slope,
        growth: slope * 7,
        fit: totalSum === 0 ? 0 : clamp01(1 - residualSum / totalSum),
        readings,
        windowDays
    };
}

export const predictMastery = (growth: GrowthResult, day: number): number =>
    growth.intercept + growth.slope * day;

/*Mastery split by difficulty band, so a user can see whether the easy questions are
carrying them. Bands come from the league's own [easy, medium, hard] triple.*/
export interface DifficultyBand {
    label: string;
    difficulty: number;
    performance: number; // mean f_i on questions of that difficulty, 0-1
    questionCount: number;
}

export interface SkillProgressContent {
    eyebrow: string;
    title: string;
    subtitle: string;
    masteryTitle: string;
    masteryHint: string;
    componentsTitle: string;
    componentsHint: string;
    growthTitle: string;
    growthHint: string;
    difficultyTitle: string;
    difficultyHint: string;
    gamesTitle: string;
    gamesHint: string;
    insightsTitle: string;
    emptyState: string;
    simulatedNote: string;
    sampleNote: string;
}

export const skillProgressContent: SkillProgressContent = {
    eyebrow: 'Player telemetry / skill progress',
    title: 'Skill Progress',
    subtitle: 'Elo says where you rank. This says what to work on.',
    masteryTitle: 'Mastery Score',
    masteryHint: `Difficulty weighted performance across your last ${MASTERY_WINDOW} games.`,
    componentsTitle: 'Profile Components',
    componentsHint: `Each part of the elo calculation, averaged over the last ${MASTERY_WINDOW} games.`,
    growthTitle: 'Growth',
    growthHint: `Least squares trend through your mastery score, re-read after every game in the last ${GROWTH_WINDOW_DAYS} days.`,
    difficultyTitle: 'Difficulty Bands',
    difficultyHint: 'How you perform as the questions get harder.',
    gamesTitle: 'Recent Games',
    gamesHint: 'Mastery earned per game, newest first.',
    insightsTitle: 'What To Work On',
    emptyState: 'No ranked games on record yet. Play a match and your skill progress starts building.',
    simulatedNote: 'Per question telemetry is simulated until the analytics endpoints land.',
    sampleNote: 'No games on record yet, so this is a sample history. Play a match to replace it with your own.'
};

export interface Insight {
    id: string;
    tone: 'good' | 'warn' | 'info';
    title: string;
    body: string;
}

export function buildInsights(
    components: ComponentScore[],
    growth: GrowthResult,
    mastery: number,
    league: string
): Insight[] {
    const insights: Insight[] = [];
    const scored = components.filter(component => component.gamesCounted > 0);

    if (scored.length > 0) {
        const weakest = scored.reduce((low, component) => (component.value < low.value ? component : low));
        const strongest = scored.reduce((high, component) => (component.value > high.value ? component : high));

        insights.push({
            id: 'weakest',
            tone: 'warn',
            title: `${weakest.label} is your weakest component at ${weakest.value}%`,
            body: weakest.hint
        });

        if (strongest.key !== weakest.key) {
            insights.push({
                id: 'strongest',
                tone: 'good',
                title: `${strongest.label} is carrying you at ${strongest.value}%`,
                body: 'Keep it there and spend your practice time on the weaker components.'
            });
        }
    }

    if (growth.readings.length < 2) {
        insights.push({
            id: 'growth-thin',
            tone: 'info',
            title: 'Not enough readings for a trend yet',
            body: `Growth needs a few games inside the ${growth.windowDays} day window before the line means anything.`
        });
    } else if (growth.growth > GROWTH_FLAT_THRESHOLD) {
        insights.push({
            id: 'growth-up',
            tone: 'good',
            title: `Mastery is climbing ${growth.growth.toFixed(2)} points a week`,
            body: 'The trend line is pointing up over the last 30 days. Whatever you changed, keep doing it.'
        });
    } else if (growth.growth < -GROWTH_FLAT_THRESHOLD) {
        insights.push({
            id: 'growth-down',
            tone: 'warn',
            title: `Mastery is sliding ${Math.abs(growth.growth).toFixed(2)} points a week`,
            body: 'Your recent games are scoring below your earlier ones in this window.'
        });
    } else {
        insights.push({
            id: 'growth-flat',
            tone: 'info',
            title: 'Mastery is holding flat',
            body: 'Your last 30 days sit on a level trend line. Harder questions are the usual way to move it.'
        });
    }

    const ceiling = masteryCeiling(league);
    insights.push({
        id: 'league-scale',
        tone: 'info',
        title: `Scored against ${league || 'your'} league difficulty`,
        body: `Mastery is capped at ${ceiling.toFixed(0)} here, so expect a dip on promotion - the questions get harder before you do. It measures your own progress, not other players.`
    });

    if (mastery === 0) {
        insights.push({
            id: 'no-data',
            tone: 'info',
            title: 'Mastery starts at zero',
            body: skillProgressContent.emptyState
        });
    }

    return insights;
}