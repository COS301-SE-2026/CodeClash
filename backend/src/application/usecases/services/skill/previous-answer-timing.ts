import { IQuestionTiming } from "src/application/interfaces/skill/IQuestionTiming";
import { SubmissionComponent } from "src/entities/components";

// question starts when players last answer lands ( or at match start for the first question )
// and it then therefore ends when its own last attempt lands, its fairly rudimentary but its the best solution for now

export class PreviousAnswerTiming implements IQuestionTiming {
    timeTaken(submissions: SubmissionComponent[], match_start: Date): Map<SubmissionComponent, number> {
        const times = new Map<SubmissionComponent, number>();

      const answered = submissions.filter(s => s.submitted_at !== null).sort((a, b) => a.started_at.getTime() - b.started_at.getTime());

      let previous = match_start.getTime();
      for (const submission of answered) {
        const landed = submission.submitted_at!.getTime();
        times.set(submission, Math.max(0, landed - previous));
        previous = Math.max(previous, landed);
      }
        
        return times;
    }
}
