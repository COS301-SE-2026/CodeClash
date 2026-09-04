import { AnswerDTO } from "../../../../../entities/dtos/answer.dto";

export interface MathsMarker {
    mark(submission: string, answer: AnswerDTO): boolean;
}