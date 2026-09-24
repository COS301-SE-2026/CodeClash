import axios from 'axios';
import type {
    GameDomain,
    GameSample,
    MatchOutcome,
    QuestionSample
} from 'src/Models/SkillProgressModel';
import { leagueProfile } from 'src/Models/SkillProgressModel';
import { getComplexityProvider } from 'src/services/complexity.service';
import { seededRandom } from 'src/utils/seededRandom';

// skill progress requires question by question information, so this is to grab questions from match history and then 
// use that information for atleast some of the logic and code n stff
// 
interface MatchHistoryRow {
    match_id: string;
    mode: string;
    game_type: string;
    match_start: string;
    result: MatchOutcome;
    score: string;
}

export interface SkillTelemetry {
    games: GameSample[];
    /*'matches' when the games came from real history, 'simulated' when there was no
    history at all and the whole set was generated for the demo.*/
    source: 'matches' | 'simulated';
    matchCount: number;
    wins: number;
    losses: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/*How well a player tends to do given how the game went. Real per question ratios will
replace this the moment they exist.*/
const baselineFor = (result: MatchOutcome): number => {
    if (result === 'WIN') return 0.74;
    if (result === 'DRAW') return 0.62;
    return 0.5;
};

const toDomain = (gameType: string): GameDomain =>
  gameType?.toLowerCase() === 'math' ? 'math' : 'programming';

function difficultyFor(random: () => number, difficulties: [number, number, number]): number {
    const roll = random();
    if (roll < 0.4) return difficulties[0];
    if (roll < 0.75) return difficulties[1];
    return difficulties[2];
}

// per question telemetry based on game !! to make lives easier and more streamlined basically
// 
function answeredRatios(domain: GameDomain, baseline: number, spread: (value: number) => number): QuestionSample['ratios'] {
    if (domain === 'math') {
        return { time: spread(baseline + 0.05), accuracy: spread(baseline) };
    }
    return { time: spread(baseline + 0.05), speed: spread(baseline - 0.05) };
}

const resultFor = (form: number): MatchOutcome => {
    if (form > 0.68) return 'WIN';
    if (form > 0.6) return 'DRAW';
    return 'LOSS';
};

async function buildQuestions(
    matchId: string,
    domain: GameDomain,
    league: string,
    result: MatchOutcome
): Promise<QuestionSample[]> {
    const profile = leagueProfile(league);
    const random = seededRandom(matchId);
    const baseline = baselineFor(result);

    const questions: QuestionSample[] = [];
    for (let index = 0; index < profile.questionCount; index++) {
        const difficulty = difficultyFor(random, profile.difficulty);

        // A question the player never got to scores zero across the board, which is what
        // the doc wants - unanswered questions drag mastery down.
        const attempted = random() > 0.12;
        const spread = (value: number) => Math.min(1, Math.max(0, value + (random() - 0.5) * 0.3));

        if (!attempted) {
            questions.push({ difficulty, ratios: domain === 'math' ? { time: 0, accuracy: 0 } : { time: 0, speed: 0 } });
            continue;
        }

      questions.push({ difficulty, ratios: answeredRatios(domain, baseline, spread) });
    }

    if (domain !== 'programming') return questions;

    // Time and space complexity are the LLM's job. Ask the active provider and fold its
    // verdicts into the same ratio bag the elo calculation reads.
    const report = await getComplexityProvider().analyse({
        matchId,
        questions: questions.map((question, index) => ({ index, difficulty: question.difficulty }))
    });

    for (const verdict of report.verdicts) {
        const question = questions[verdict.index];
        if (!question) continue;
        // Unanswered questions stay at zero - there is no submission to analyse.
        const answered = (question.ratios.time ?? 0) > 0;
        question.ratios.timeCx = answered ? verdict.timeRatio : 0;
        question.ratios.spaceCx = answered ? verdict.spaceRatio : 0;
    }

    return questions;
}

async function toGameSample(row: MatchHistoryRow, league: string): Promise<GameSample> {
    const domain = toDomain(row.game_type);
    return {
        matchId: row.match_id,
        playedAt: new Date(row.match_start).toISOString(),
        domain,
        league,
        result: row.result,
        questions: await buildQuestions(row.match_id, domain, league, row.result),
        simulated: true
    };
}

async function simulatedHistory(league: string, now: Date): Promise<GameSample[]> {
    const random = seededRandom(`demo:${league}`);
    const games: GameSample[] = [];
    const total = 26;

    for (let index = 0; index < total; index++) {
        // Newest first, spread over the 30 day growth window.
        const daysAgo = (index / total) * 29 + random() * 0.6;
        const playedAt = new Date(now.getTime() - daysAgo * DAY_MS);
        // Recent games lean better so the trend line has something to say.
        const form = 0.55 + (1 - index / total) * 0.22 + (random() - 0.5) * 0.12;
      const result = resultFor(form);
        const domain: GameDomain = random() > 0.45 ? 'programming' : 'math';
        const matchId = `demo-${index}`;

        games.push({
            matchId,
            playedAt: playedAt.toISOString(),
            domain,
            league,
            result,
            questions: await buildQuestions(matchId, domain, league, result),
            simulated: true
        });
    }

    return games;
}

export async function loadSkillTelemetry(
    token: string | null,
    league: string,
    now: Date = new Date()
): Promise<SkillTelemetry> {
    let rows: MatchHistoryRow[] = [];

    // A failed fetch is left to reject so the ViewModel reports it. Falling back to the
    // sample history here would show a network error as a page of made up games.
    if (token) {
        const response = await axios.get<MatchHistoryRow[]>('/api/matches', {
            headers: { Authorization: `Bearer ${token}` }
        });
        rows = Array.isArray(response.data) ? response.data : [];
    }

    if (rows.length === 0) {
        const games = await simulatedHistory(league, now);
        return {
            games,
            source: 'simulated',
            matchCount: games.length,
            wins: games.filter(game => game.result === 'WIN').length,
            losses: games.filter(game => game.result === 'LOSS').length
        };
    }

    const sorted = rows
        .slice()
        .sort((a, b) => new Date(b.match_start).getTime() - new Date(a.match_start).getTime());

    const games = await Promise.all(sorted.map(row => toGameSample(row, league)));

    return {
        games,
        source: 'matches',
        matchCount: games.length,
        wins: games.filter(game => game.result === 'WIN').length,
        losses: games.filter(game => game.result === 'LOSS').length
    };
}