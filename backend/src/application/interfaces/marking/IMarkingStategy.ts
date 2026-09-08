import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { AnswerDTO } from "../../../entities/dtos/answer.dto";

export interface MarkingStrategy{
    mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: AnswerDTO): Promise<boolean>;
}