import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";

export interface MarkOutcome {
    correct: boolean;
    run_time_ms?: number | null;
    memory_kb?: number | null;
    
}

export interface IMarkingStrategy {
  mark(submission: PlayerSubmissionDTO): Promise<MarkOutcome>;
}