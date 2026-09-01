import { MathsSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";


export class MarkMaths implements MarkingStrategy {

    mark(submission: MathsSubmissionDTO,answer: string): boolean {

    }
}