import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";

export interface IMarkingStrategy {
    mark(submission: PlayerSubmissionDTO): Promise<boolean>;
}