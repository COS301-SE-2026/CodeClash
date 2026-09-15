import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { AnswerDTO } from "../../../entities/dtos/questions/answer.dto";

export interface MarkingStrategy{
    mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: AnswerDTO): Promise<boolean>;
}