import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { AnswerDTO } from "../../../entities/dtos/match/answer.dto";

export interface IMarkingStrategy{
    mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: AnswerDTO): Promise<boolean>;
}