import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { AnswerDTO } from "../../../entities/dtos/questions/answer.dto";

export interface IMarkingStrategy {
    mark(submission: PlayerSubmissionDTO): Promise<boolean>;
}