// place holder complexity service for once integration has been properly done with llm integration or other
// 
import { seededRandom } from "src/utils/seededRandom";

export interface ComplexityQuestion {
    index: number;
  difficulty: number;
  // index of question within game
}

export interface ComplexityRequest {
    matchId: string;
    language?: string;
  questions: ComplexityQuestion[];
  // resquest for complexity of the question
}

export interface ComplexityVerdict {
    index: number;
// the ratios for how close the solutiosn are to optimal
    timeRatio: number;
    spaceRatio: number;
    /*Human readable big-O, for tooltips and the per question breakdown later on.*/
    timeLabel: string;
    spaceLabel: string;
    optimalTimeLabel: string;
}

export interface ComplexityReport {
    matchId: string;
    source: 'mock' | 'llm';
    verdicts: ComplexityVerdict[];
}

export interface ComplexityProvider {
    readonly source: 'mock' | 'llm';
    analyse(request: ComplexityRequest): Promise<ComplexityReport>;
}

// ladder of base possible complexities for now
const TIME_LADDER = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'];
const SPACE_LADDER = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'];

const pick = (ladder: string[], index: number): string =>
  ladder[Math.min(ladder.length - 1, Math.max(0, index))]!;

export const mockComplexityProvider: ComplexityProvider = {
    source: 'mock',

    async analyse(request: ComplexityRequest): Promise<ComplexityReport> {
        const random = seededRandom(`${request.matchId}:complexity`);

        const verdicts = request.questions.map(question => {
            // Harder questions drag the ratio down a little.
            const difficultyDrag = Math.min(0.35, (question.difficulty / 24) * 0.45);
            const timeRatio = Math.min(1, Math.max(0.05, 0.72 - difficultyDrag + random() * 0.4));
            const spaceRatio = Math.min(1, Math.max(0.05, 0.78 - difficultyDrag * 0.7 + random() * 0.35));

            // A worse ratio means a worse rung on the ladder.
            const optimalRung = question.difficulty > 12 ? 3 : 2;
            const timeRung = optimalRung + Math.round((1 - timeRatio) * 2);
            const spaceRung = Math.max(0, Math.round((1 - spaceRatio) * 2));

            return {
                index: question.index,
                timeRatio,
                spaceRatio,
                timeLabel: pick(TIME_LADDER, timeRung),
                spaceLabel: pick(SPACE_LADDER, spaceRung),
                optimalTimeLabel: pick(TIME_LADDER, optimalRung)
            };
        });

        return { matchId: request.matchId, source: 'mock', verdicts };
    }
};