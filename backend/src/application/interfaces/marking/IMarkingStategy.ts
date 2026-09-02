import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { SubmissionResult } from "src/entities/dtos/submission-result.dto";

export interface MarkingStrategy{
    mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: string): Promise<SubmissionResult>;
}