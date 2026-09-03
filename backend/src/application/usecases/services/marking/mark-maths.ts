import { MathsSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { CompleteSubmissionResult, SubmissionResult } from "src/entities/dtos/submission-result.dto";

export class MarkMaths implements MarkingStrategy {

    async mark(submission: MathsSubmissionDTO,answer: string, question_id:string):  Promise<SubmissionResult> {

        // temporary until the specialised markers are implemented

        const correct = submission.answer.trim() === answer.trim();
        const result: CompleteSubmissionResult = {
            status: 'complete',
            question_id: question_id,
            correct: correct,
            speed: '',
        }

        return result;
    }
}