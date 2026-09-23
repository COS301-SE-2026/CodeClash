import { AnswerDTO } from "../../../../../entities/dtos/questions/answer.dto";

export interface MathsMarker {
    mark(submission: string, answer: AnswerDTO): boolean;
}