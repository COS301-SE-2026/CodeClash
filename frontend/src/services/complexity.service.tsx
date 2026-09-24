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