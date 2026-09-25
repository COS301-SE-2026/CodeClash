import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { AnswerDTO } from "../../../entities/dtos/questions/answer.dto";

export interface MarkOutcome {
    correct: boolean;
    run_time_ms?: number | null;
    memory_kb?: number | null;
    
}

export interface IMarkingStrategy{
    mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: AnswerDTO): Promise<MarkOutcome>;
}