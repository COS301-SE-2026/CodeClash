import { AnswerDTO } from "../../../../../entities/dtos/match/answer.dto";

export interface MathsMarker {
    mark(submission: string, answer: AnswerDTO): boolean;
}