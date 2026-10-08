import { MathsSubmissionDTO, PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { IMarkingStrategy, MarkOutcome } from "src/application/interfaces/marking/IMarkingStategy";
import { IMatchCache } from "src/application/interfaces/cache/IMatchCache";
import { MarkerRegistry } from "./maths-marking/marker-registry";

export class MarkMaths implements IMarkingStrategy {

  constructor(
    private readonly registry: MarkerRegistry = new MarkerRegistry(),
    private readonly game_cache: IMatchCache,
  ) { }
  

  async mark(submission: PlayerSubmissionDTO): Promise<MarkOutcome> {
     const correct_answer = await this.game_cache.getAnswer(submission.question_id);
        if (!correct_answer) throw new Error("Invalid question id");
        
    if (!submission.submission || !('answer' in submission.submission)) return { correct: false};

    const marker = this.registry.markerFor(correct_answer.format); // telling it which marker to use based on the format
    if (marker === null) return {correct: false};

    return {correct: marker.mark((submission.submission as MathsSubmissionDTO).answer, correct_answer)};
  }
}