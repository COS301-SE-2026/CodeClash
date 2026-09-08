import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { AnswerDTO } from "src/entities/dtos/answer.dto";
import { MarkerRegistry } from "./maths-marking/marker-registry";

export class MarkMaths implements MarkingStrategy {

  constructor(private readonly registry: MarkerRegistry = new MarkerRegistry()) { } // constructor js to make the registry available in order to pick appropriate marking file
  

  async mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: AnswerDTO): Promise<boolean> {
    if (!('answer' in submission)) return false;

    const marker = this.registry.markerFor(answer.format); // telling it which marker to use based on the format
    if (marker === null) return false;
    return marker.mark(submission.answer, answer);
  }
}