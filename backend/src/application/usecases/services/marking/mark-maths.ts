import { MathsSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { SubmissionResult } from "src/entities/dtos/submission-result.dto";

export class MarkMaths implements MarkingStrategy {

    async mark(submission: MathsSubmissionDTO,answer: string):  Promise<SubmissionResult> {

        return {
            question_id: '',
            correct: true,
            speed: ''
        }
    }
}