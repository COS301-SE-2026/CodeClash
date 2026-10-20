import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { ProgFeedbackDTO } from "src/entities/dtos/submissions/submission-result.dto";

export interface MarkOutcome {
    correct: boolean;
    run_time_ms?: number | null;
  memory_kb?: number | null;
  feedback?: ProgFeedbackDTO;
    
}

export interface IMarkingStrategy {
  mark(submission: PlayerSubmissionDTO): Promise<MarkOutcome>;
}