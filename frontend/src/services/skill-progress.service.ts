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