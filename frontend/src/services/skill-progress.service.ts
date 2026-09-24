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

        if (domain === 'math') {
            questions.push({
                difficulty,
                ratios: {
                    time: spread(baseline + 0.05),
                    accuracy: spread(baseline)
                }
            });
        } else {
            questions.push({
                difficulty,
                ratios: {
                    time: spread(baseline + 0.05),
                    speed: spread(baseline - 0.05)
                }
            });
        }
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