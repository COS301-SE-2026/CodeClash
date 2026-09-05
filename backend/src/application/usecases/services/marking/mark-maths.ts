import { MathsSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";

export class MarkMaths implements MarkingStrategy {

    async mark(submission: MathsSubmissionDTO,answer: string):  Promise<boolean> {
        const correct = submission.answer.trim() === answer.trim();
        return correct;
    }
}