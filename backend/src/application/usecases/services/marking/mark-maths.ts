import { MathsSubmissionDTO, PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { IMarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { IMatchCache } from "src/application/interfaces/cache/IMatchCache";
import { MarkerRegistry } from "./maths-marking/marker-registry";

export class MarkMaths implements IMarkingStrategy {

  constructor(
    private readonly registry: MarkerRegistry = new MarkerRegistry(),
    private readonly game_cache: IMatchCache,
  ) { }
  

  async mark(submission: PlayerSubmissionDTO): Promise<boolean> {
     const correct_answer = await this.game_cache.getAnswer(submission.question_id);
        if (!correct_answer) throw new Error("Invalid question id");

    if (!('answer' in submission)) return false;

    const marker = this.registry.markerFor(correct_answer.format); // telling it which marker to use based on the format
    if (marker === null) return false;

    return marker.mark((submission.submission as MathsSubmissionDTO).answer, correct_answer);
  }
}